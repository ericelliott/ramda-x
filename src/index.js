const trace = label => value => (console.log(`${label}: ${JSON.stringify(value, null, 2)}`), value)

const curry = (fn) => {
    return function f1(...args) {
        return args.length >= fn.length
            ? fn(...args)
            : (...moreArgs) => f1(...[...args, ...moreArgs])
    }
}

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

const map = curry((fn, data) => data.map(fn))

const filter = curry((fn, data) => data.filter(fn))

const prop = curry((property, data) => data[property])

const propEq = curry((key, value, data) => {
    return data[key] === value
        ? true
        : false
})

const reduce = curry((fn, config, data) => {
    return config === null
        ? data.reduce(fn)
        : data.reduce(fn, config)
})

const Task = (computation, cleanup = () => { }) => ({
    fork: computation,
    cleanup,
    map: f => Task((reject, resolve) => computation((a) => reject(a), b => resolve(f(b)), cleanup)),
    chain: f => Task((reject, resolve) => computation((a) => reject(a), b => f(b).fork(reject, resolve), cleanup)),
})

Task.of = b => Task((_, resolve) => resolve(b))

const Either = () => { }

Either.Right = x =>
    ({
        chain: f => f(x),
        map: f => Either.Right(f(x)),
        fold: f => (f, g) => g(x),
    })

Either.Left = x =>
    ({
        chain: f => Either.Left(x),
        map: f => Either.Left(x),
        fold: (f, g) => f(x),
    })
Either.fromNullable = x =>
    x !== null ? Either.Right(x) : Either.Left(x)

Either.of = x => Either.Right(x)

module.exports = {
    curry,
    trace,
    compose,
    map,
    filter,
    prop,
    propEq,
    reduce,
    Task,
    Either
}
