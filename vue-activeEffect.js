const bucket = new WeakMap()
const data = { ok: true, text: 'hello vue3' }

// 用一个全局变量存储被注册的副作用函数
let activeEffect
function effect(fn) {
  const effectFn = () => {
    // 当effectFn执行时，将其设置为当前激活的副作用函数
    activeEffect = effectFn
    fn()
  }

  // activeEffect.deps用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}

const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数activeEffect添加到存储副作用函数的桶中
    track(target, key)
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newValue) {
    // 设置属性值
    target[key] = newValue
    // 把副作用函数从桶里取出并执行
    trigger(target, key)
  }
})

function track(target, key) {
  // 没有activeEffect，直接return
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  // 把当前激活的副作用函数添加到依赖集合deps中
  deps.add(activeEffect)
  // deps就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到activeEffect.deps数组中
  activeEffect.deps.push(deps)  // 新增
}

// 在set拦截函数内调用trigger函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  
  const effectsToRun = new Set(effects)
  effectsToRun.forEach(effectFn => effectFn())
}

function cleanup(effectFn) {
  // 遍历effectFn.deps数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps是依赖集合
    const deps = effectFn.deps[i]
    // 将effectFn从依赖集合中移除
    deps.delete(effectFn)
  }
  // 最后需要重置effectFn.deps数组
  effectFn.deps.length = 0
}



effect(function effectFn() {
  document.body.innerText = obj.ok ? obj.text : 'not'
})
setTimeout(() => {
  obj.text = 'hello proxy data'
}, 2000)