"use strict";(self.webpackChunkgo_zero=self.webpackChunkgo_zero||[]).push([[8434],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),c=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},m=function(e){var t=c(e.components);return o.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},p=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=c(n),d=r,f=p["".concat(s,".").concat(d)]||p[d]||u[d]||i;return n?o.createElement(f,a(a({ref:t},m),{},{components:n})):o.createElement(f,a({ref:t},m))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var c=2;c<i;c++)a[c]=n[c];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}p.displayName="MDXCreateElement"},5493:function(e,t,n){n.r(t),n.d(t,{default:function(){return u},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return c}});var o=n(7462),r=n(3366),i=(n(7294),n(3905)),a=["components"],l={},s={unversionedId:"blog/governance/bloom",id:"blog/governance/bloom",isDocsHomePage:!1,title:"Bloom Filter",description:"The go-zero microservice framework provides many out-of-the-box tools.",source:"@site/docs/blog/governance/bloom.md",sourceDirName:"blog/governance",slug:"/blog/governance/bloom",permalink:"/docs/blog/governance/bloom",editUrl:"https://github.com/zeromicro/portal/edit/main/docs/blog/governance/bloom.md",version:"current",lastUpdatedAt:1651391716,formattedLastUpdatedAt:"5/1/2022",frontMatter:{},sidebar:"blog",previous:{title:"Blog",permalink:"/docs/blog/blog"},next:{title:"Fusing Principle and Implementation",permalink:"/docs/blog/governance/breaker-algorithms"}},c=[{value:"Bloom filter bloom",id:"bloom-filter-bloom",children:[]}],m={toc:c};function u(e){var t=e.components,n=(0,r.Z)(e,a);return(0,i.kt)("wrapper",(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"The go-zero microservice framework provides many out-of-the-box tools.\nGood tools can not only improve the performance of the service,\nbut also improve the robustness of the code to avoid errors,\nand realize the uniformity of the code style for others to read, etc.\nA series of articles will respectively introduce the use of tools in the go-zero framework and their implementation principles."),(0,i.kt)("h2",{id:"bloom-filter-bloom"},"Bloom filter ",(0,i.kt)("a",{parentName:"h2",href:"https://github.com/zeromicro/go-zero/blob/master/core/bloom/bloom.go"},"bloom")),(0,i.kt)("p",null,"When doing server development, I believe you have heard of Bloom filters,\nyou can judge whether a certain element is in the collection,\nbecause there are certain misjudgments and delete complex problems,\nthe general usage scenario is: to prevent cache breakdown (to prevent malicious Attacks),\nspam filtering, cache digests, model detectors, etc.,\nto determine whether there is a row of data to reduce disk access and improve service access performance.\nThe simple cache package bloom.bloom provided by go-zero, the simple way to use it is as follows."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-go"},'// Initialize redisBitSet\nstore := redis.NewRedis("redis \u5730\u5740", redis.NodeType)\n// Declare a bitSet, key="test_key" name and bits are 1024 bits\nbitSet := newRedisBitSet(store, "test_key", 1024)\n// Determine whether the 0th bit exists\nisSetBefore, err := bitSet.check([]uint{0})\n\n// Set the 512th bit to 1\nerr = bitSet.set([]uint{512})\n// Expires in 3600 seconds \nerr = bitSet.expire(3600)\n\n// Delete the bitSet\nerr = bitSet.del()\n')),(0,i.kt)("p",null,"Bloom briefly introduced the use of the most basic redis bitset. The following is the real bloom implementation."),(0,i.kt)("p",null,"Position the element hash"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-go"},"// The element is hashed 14 times (const maps=14), and byte (0-13) is appended to the element each time, and then the hash is performed.\n// Take the modulo of locations[0-13], and finally return to locations.\nfunc (f *BloomFilter) getLocations(data []byte) []uint {\n    locations := make([]uint, maps)\n    for i := uint(0); i < maps; i++ {\n        hashValue := hash.Hash(append(data, byte(i)))\n        locations[i] = uint(hashValue % uint64(f.bits))\n    }\n\n    return locations\n}\n")),(0,i.kt)("p",null,"Add elements to bloom"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-go"},"// We can find that the add method uses the set methods of getLocations and bitSet.\n// We hash the elements into uint slices of length 14, and then perform the set operation and store them in the bitSet of redis.\nfunc (f *BloomFilter) Add(data []byte) error {\n    locations := f.getLocations(data)\n    err := f.bitSet.set(locations)\n    if err != nil {\n        return err\n    }\n    return nil\n}\n")),(0,i.kt)("p",null,"Check if there is an element in bloom"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-go"},"// We can find that the Exists method uses the check method of getLocations and bitSet\n// We hash the elements into uint slices of length 14, and then perform bitSet check verification, return true if it exists, false if it does not exist or if the check fails\nfunc (f *BloomFilter) Exists(data []byte) (bool, error) {\n    locations := f.getLocations(data)\n    isSet, err := f.bitSet.check(locations)\n    if err != nil {\n        return false, err\n    }\n    if !isSet {\n        return false, nil\n    }\n\n    return true, nil\n}\n")),(0,i.kt)("p",null,"This section mainly introduces the ",(0,i.kt)("inlineCode",{parentName:"p"},"core.bloom")," tool in the go-zero framework, which is very practical in actual projects. Good use of tools is very helpful to improve service performance and development efficiency. I hope this article can bring you some gains."))}u.isMDXComponent=!0}}]);