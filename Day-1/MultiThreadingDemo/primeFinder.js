function isPrime(num){
	if (num <= 3) return true;
	for(var i=2;i<= num/2;i++)
		if (num % i == 0) return false;
	return true;
}

self.addEventListener("message",function(msgEvt){
	var req = msgEvt.data,
		result = 0,
		delta = (req.end - req.start)/10;

	for(var i=req.start;i<=req.end;i++){
		if (isPrime(i)) result++;
		if (((i - req.start) % delta) == 0){
			var percentCompleted = ((i - req.start) / delta) * 10;
			self.postMessage({
				percentCompleted : percentCompleted,
				primeCount : result,
				type : "progress"
			});
		}
	}
	self.postMessage({
		start : req.start,
		end : req.end,
		primeCount : result,
		type : "completed"
	});
})