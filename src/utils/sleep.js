const sleep = (timeout = 500) => new Promise((resolve) => { setTimeout(resolve, timeout); });

export default sleep;
