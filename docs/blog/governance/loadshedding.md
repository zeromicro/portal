# Load Shedding

## Service Adaptive Load Shedding Protection Design

## Design Purpose

* To ensure that the system is not brought down by excessive requests
* Provide the highest possible throughput while maintaining system stability

## Design Considerations

* How to measure system load
	* Whether it is in a virtual machine or container that needs to read cgroup-related load
	* Use 1000m for 100% CPU, 800m recommended for high system load
* Smallest possible Overhead that does not significantly increase RT
* Disregard DB or cache system issues that the service itself depends on, such issues are solved by the meltdown mechanism

## Mechanism design

* Use sliding average when calculating CPU load to reduce instability caused by CPU load jitter, see references for sliding average
	* The sliding average is an approximate average of the previous N consecutive values, and the value of N can be determined by the superparameter beta.
	* When the CPU load is larger than the specified value, the down load protection mechanism is triggered.
* Time window mechanism, using the sliding window mechanism to record the QPS and RT (response time) in the previous time window
	* The sliding window uses 50 buckets in 5 seconds, each bucket saves the requests within 100ms of time and recycles them, with the newest overwriting the oldest
	* When calculating maxQPS and minRT, we need to filter out the latest bucket that has not run out of time, to prevent only a very small number of requests in this bucket, and RT is at a very small value with low probability, so when calculating maxQPS and minRT, only 49 buckets will be counted according to the 50 buckets parameter above
* The request is rejected if all of the following conditions are met
	1. the current CPU load exceeds a preset threshold, or the last rejection time is no more than 1 second (cooling off period). The cooling off period is so that the load just down immediately increase the pressure to cause immediately up again back and forth jitter
	2. `averageFlying > max(1, QPS*minRT/1e3)`
		* averageFlying = MovingAverage(flying)
		* When calculating MovingAverage(flying), the default value of superparameter beta is 0.9, which means the average flying value of the first ten times is calculated.
		* When taking the flying value, there are three approaches.
			1. update the averageFlying once after the request is added, see the orange curve in the figure
			2. update averageFlying once after the request ends, see the green curve in the figure
			3. update averageFlying once after the request is incremented and once after the request ends

		  We use the second one, which can better prevent jitter, as shown in the figure.
		  ![flying strategy comparison](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/shedding_flying.jpg)
		* QPS = maxPass * bucketsPerSecond
			* maxPass denotes the number of successful requests in each valid bucket
			* bucketsPerSecond indicates how many buckets per second
		* 1e3 means 1000 milliseconds, minRT unit is also milliseconds, QPS * minRT/1e3 gets is the average number of concurrent requests per point in time

## Use of droploads

* Optional activation configuration has been added to the rest and zrpc framework
	* CpuThreshold, if the value is set to a value greater than 0, then the service's auto-drop mechanism is activated
* If the request is dropped, then the error log will have the `dropreq` keyword

## Reference

* [Sliding Average](https://www.cnblogs.com/wuliytTaotao/p/9479958.html)
* [Sentinel Adaptive Flow Limiting](https://github.com/alibaba/Sentinel/wiki/%E7%B3%BB%E7%BB%9F%E8%87%AA%E9%80%82%E5%BA%94%E9%99%90%E6%B5%81)
* [Kratos Adaptive Flow Limiting Protection](https://github.com/bilibili/kratos/blob/master/doc/wiki-cn/ratelimit.md)
