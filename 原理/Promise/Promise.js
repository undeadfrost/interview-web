// 定义Promise的三种状态常量
const Pending = 'Pending' // 进行中
const Fulfilled = 'Fulfilled' // 已成功
const Rejected = 'Rejected' // 已失败

function isFunction(variable) {
	return (typeof variable === 'function')
}

class PromiseA {
	constructor(handle) {
		// 参数必须为函数
		if (!isFunction(handle)) {
			throw new Error('参数必须是function')
		}
		
		// 状态
		this._status = Pending
		
		// 返回值
		this._value = undefined
		
		// 成功的回调
		this._fulfilledQueues = []
		
		// 失败的回调
		this._rejectedQueues = []
		
		try {
			handle(this._resolve.bind(this), this._reject.bind(this))
		} catch (err) {
			this._reject(err)
		}
	}
	
	_resolve(val) {
		if (this._status !== Pending) return
		const run = () => {
			this._status = Fulfilled
			this._value = val
			let callback
			while ((callback = this._fulfilledQueues.shift())) {
				callback(val)
			}
		}
		setTimeout(run, 0)
	}
	
	_reject(err) {
		if (this._status !== Pending) return
		const run = () => {
			this._status = Rejected
			this._value = err
			let callback
			while ((callback = this._rejectedQueues.shift())) {
				callback(err)
			}
		}
		setTimeout(run, 0)
	}
	
	then(onFulfilled, onRejected) {
		const {_status, _value} = this
		switch (_status) {
			case Pending:
				this._fulfilledQueues.push(onFulfilled)
				this._rejectedQueues.push(onRejected)
				break
			case Fulfilled:
				onFulfilled(_value)
				break
			case Rejected:
				onRejected(_value)
				break
		}
	}
}

