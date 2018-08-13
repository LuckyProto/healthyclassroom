// https://juejin.im/entry/584df86d8d6d810054531526
let API_HOST = "http://xxx.com/xxx";
let DEBUG = true;//开发模式 
// let DEBUG = false;//生产模式   
var Mock = require('mock-min.js')
function ajax(data = '', fn, method = "get", header = {}) {
	if (!DEBUG) {
		wx.request({
			url: config.API_HOST + data,
			method: method ? method : 'get',
			data: {},
			header: header ? header : { "Content-Type": "application/json" },
			success: function (res) {
				fn(res);
			}
		});
	} else {
		// 模拟数据（注@后面是可变参数可以查看mock.js）  
		var res = Mock.mock({
			'data|1': [{
				'imgUrls': [
					"../../images/index/u8.png",
					"../../images/index/u9.png",
					"../../images/index/u10.png"
				],
				'videoList|1-10': [{
					'courseId|+1': 1,
					// 'img': "@image('200x100', '#4A7BF7','#fff','pic')",
					// 'title': '@ctitle(3,8)',
					// 'city': "@county(true)",
					// 'zip': "@zip(6)",
					// 'stock_num': '@integer(0,10)',//库存数量    
					// 'marketing_start': '@datetime()',
					// 'marketing_stop': '@now()',
					// 'price': '@integer(100,2000)',//现价，单位：分    
					// 'original_price': '@integer(100,3000)',
					'courseImgUrl': '../../images/course/course1.png',
					'courseMainImgUrl': '../../images/course/lessons4.png',
					'courseName': '@cname()',
					'courseIntroduce': "甲状腺疾病是十分常见的，患者中妇女较多，甲状腺疾病有两大类，即甲状腺不够活跃（甲状腺机能减退）和甲状腺过度活跃",
					'benefitPeople':"患有甲状腺疾病的患者",
					'goodsIntroduce': "可无限次观看,当前仅支持按系列购买,当前仅支持按系列购买,此课程属于虚拟商品,一经购买后无法退款",
					'lessons|1-10': [
						{
							'lessonId|+1': 1,
							'lessonName': '@cname()',
							'lessonImg': '../../images/course/course1.png', 
							'isFree': '@boolean()',
							'lessonDuring|3-15': 1,
							'ViewdAmount|0-100': 1,
							'doctorId|+1': 1,
							'doctorName': '@cname()',
							'doctorHospital': '协和医院',
							'doctorImg': '../../images/course/doctor1.png',
							'isHostest': '@boolean()',
							'isFamous': '@boolean()',
							'isCareful': '@boolean()',
							'jobTitle': '内分泌科甲状腺颈部外科主任医师,儿科医生',
							'goodAt': '长期从事内分泌疾病临床和基础研究，尤其是下丘脑垂体疾病的基础和临床研究，擅长各种儿童及成人疑难内分泌疾病的诊疗，尤其是下丘脑垂体疾病（如垂体瘤、肢端肥大症、泌乳素瘤、库欣病、尿崩症、颅咽管瘤、颅内生殖细胞瘤、SIADH、矮小症、性早熟、席汉病等），以及糖尿病、甲状腺疾病和神经内分泌肿瘤等疑难内分泌疾病的诊疗。'
						}
					],
					'coursePrice|5000-8000': 1,
					'purchasedAmount|400-8000':1 ,
					// 'doctors|1-6': [{
					// 	'doctorName': '@cname()',
					// 	'doctorHospital': '协和医院',
					// 	'jobTitle': '内分泌科甲状腺颈部外科主任医师,儿科医生'
					// }],
					'isPurchased': '@boolean()',
					'isStored': '@boolean()'
				}]
			}]
		})
		// 输出结果  
		// console.log(JSON.stringify(res, null, 2))  
		fn(res);
	}
}
module.exports = {
	ajax: ajax
}  