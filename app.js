var budgetController = (function(){
	
	var Expenses = function(id,description, value){
		this.id=id,
		this.description=description,
		this.value=value
	}
	var Incomes = function(id,description, value){
		this.id=id,
		this.description=description,
		this.value=value
	}

	var data = {
		allItems: {
			inc:[],
			exp:[]
		},
		totals:{
			inc:0,
			exp:0
		},
		budget:0,
		percentage:0,
		perPercentage:[]
	}

	 var calTotals= function(type){
		var sum=0;

		data.allItems[type].forEach(function(cur){
			sum += cur.value
		})
		data.totals[type]=sum;
	}

return {
	addItem:function(type,des,val){
		var newItem,ID;
		if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

		if(type==='exp'){
			
			newItem = new Expenses(ID,des,val)
			
		}else{
			newItem = new Incomes(ID,des,val)
			
		}
		data.allItems[type].push(newItem);
		return newItem
	},
	calcBudget:function(){


		//1)calculate total expense and total income
		calTotals('inc');
		calTotals('exp');

		//2)calculate budget
		data.budget = data.totals.inc - data.totals.exp
		
		//3)calculate percentage
		if(data.totals.inc>0&&data.totals.inc>data.totals.exp){
		data.percentage = Math.round((data.totals.exp / data.totals.inc)  * 100)

	}else{
		data.percentage=-1;
	}



	},

	getbudget: function(){
		return {
			totalexpense:data.totals.exp,
			totalincome:data.totals.inc,
			budget:data.budget,
			percentage:data.percentage
		}
	},
	DeleteItemFromDs:function(ID,type){

		var ids = data.allItems[type].map(function(curr){
			return curr.id;
		})

		var index = ids.indexOf(ID)

		data.allItems[type].splice(index,1)


		// var tarobj=data.allItems[type].map(function(cur){
		// 	if(cur.id===ID){
		// 		return cur;
		// 	}else{
		// 		return 0;
		// 	}
		// })
		

		// var index = data.allItems[type].indexOf(tarobj[2])

		// data.allItems[type].splice(index,1)

	},
	calcPercentage:function(){

		if(data.totals.inc>0){

		var perItemExpense=data.allItems.exp.map((cur)=>{
		 	return	cur.value
		})

		var perItemPercentage = perItemExpense.map(function(curr){

			return  Math.round((curr/data.totals.inc) * 100)
		})

		data.perPercentage=perItemPercentage
	}else{
		data.perPercentage=-1
	}


	},

	getPercentage:function(){
		return data.perPercentage;
	},

	 getCalcMonth :function(){
				var monthNames,month,year

			monthNames= ["January", "February", "March", "April", "May", "June",
		                              "July", "August", "September", "October", "November", "December"
		                          ];

		  month = monthNames[new Date().getMonth()]
		  year  = new Date().getFullYear()
		
		return {
			perMonth:month,
			perYear:year
		}

	},

	testing : function(){
		console.log(data) 
	}

	}

})();


/////
/////
//////
/////
////



var uiController = (function(){

var domStrings = {
	getType:'.add__type',
	getDescription:'.add__description',
	getValue:'.add__value',
	getButton:'.add__btn',
	incomeContainer:'.income__list',
	expenseContainer:'.expenses__list',
	incomeLabel:'.budget__income--value',
	expensesLabel:'.budget__expenses--value',
	budgetLabel:'.budget__value',
	percentageLabel:'.budget__expenses--percentage',
	container:'.container',
	elLabel:'.item__percentage',
	monthName:'.budget__title--month'

}

var formatNumber = function(num,type){
	var sign;
	// change the number to absolute type
	//add decimal place before last 2 nos
	//add a comma after required place

	// + 2000.548,+25000,+250000

	num = Math.abs(num);  //2000
	num = num.toFixed(2); //'2000'

	num=num.split('.');  // ['2000','00']

	int = num[0] // '2000'
	if(int.length > 3){

	int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3) //'2,000'
}
	dec = num[1] //  '00' 


type==='inc'? sign= '+ ' : sign= '- '

formatedNumber=sign + int + '.' +dec

return formatedNumber;



}


return	{Values:function(){

	return {      
	   type:document.querySelector(domStrings.getType).value ,// we get inc or dec
description:document.querySelector(domStrings.getDescription).value,
	  value:Number(document.querySelector(domStrings.getValue).value)
	    }
     },
         getDomStrings:function(){
			return domStrings
		},
		
		addListItem:function(obj,type){
				var html,newHtml,element;


				if(type==='inc'){
					element = domStrings.incomeContainer
					html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>\
					<div class="right clearfix"><div class="item__value">%value%</div>\
					<div class="item__delete"><button class="item__delete--btn">\
					<i class="ion-ios-close-outline"></i></button></div></div></div>'

				}else if(type==='exp'){
					element = domStrings.expenseContainer
					 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>\
					 <div class="right clearfix"><div class="item__value">%value%</div>\
					 <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">\
					 <i class="ion-ios-close-outline"></i></button></div></div></div>'
				}
	newHtml = html.replace('%id%',obj.id)
	newHtml = newHtml.replace('%description%',obj.description)

	if(type==='inc'){

	newHtml = newHtml.replace('%value%',formatNumber(obj.value,'inc'))
	}else{
		newHtml = newHtml.replace('%value%',formatNumber(obj.value,'exp'))
	}

		document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)

		

	},clearFields:function(){
		var Fields = document.querySelectorAll(domStrings.getDescription+','+domStrings.getValue)
		var arrFields = Array.from(Fields)
		

		arrFields.forEach(function(current,index,array){
			current.value='';
		})

		arrFields[0].focus();
		
	},
	budgetDisplay: function(obj){

		document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalincome,'inc')
		document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalexpense,'exp') 
		
		if(obj.budget>=0){
		document.querySelector(domStrings.budgetLabel).textContent =  formatNumber(obj.budget,'inc') 
		}else{
			document.querySelector(domStrings.budgetLabel).textContent =  formatNumber(obj.budget,'exp')
		}


		if(obj.percentage>0){

		document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%'
	}else{
		document.querySelector(domStrings.percentageLabel).textContent = '---'
	}

	},

	deleteListitem: function(selectorId){
		document.getElementById(selectorId).remove()

	},
	
	displayElmPercentage:function(percentage){

		var fields = document.querySelectorAll(domStrings.elLabel)


		var nodeListForEach = function(list,callback){

			for(var i=0;i<list.length;i++){

				callback(list[i],i);

			}

		}


		nodeListForEach(fields,function(current,index){
			if(percentage[index] > 0){

			current.textContent=percentage[index] + '%'

			}else{

				current.textContent='---'
				
			}


		})


	},

	displayMonth : function (year,month){

		document.querySelector(domStrings.monthName).textContent=year + ' ' + month;

	},

	changeInput:function(){

		var nodeList = document.querySelectorAll(domStrings.getType + ',' + 
			domStrings.getDescription + ',' +
			domStrings.getValue);

		var array = Array.from(nodeList)

		array.forEach((cur)=>{

			cur.classList.toggle('red-focus')

		})

		document.querySelector(domStrings.getButton).classList.toggle('red')







	}

	// updateElmPercentage:function(elPercentage){

	// 	var list = document.querySelectorAll(domStrings.elLabel)

	// 	var perArray = Array.from(list);

	// 	perArray.forEach(function(cur,i){
	// 		if(elPercentage[i] > 0){

	// 			cur.textContent=elPercentage[i]
	// 		}else{
	// 			cur.textContent='---'	
	// 		}
			
				
	// 		})

	// }

}

})();


var controller = (function(){

	var YearnMonth = budgetController.getCalcMonth()

	var setupEventListeners = function(){
		var doms = uiController.getDomStrings()

	document.querySelector(doms.getButton).addEventListener('click',ctrlAddItem)

	document.addEventListener('keypress',function(event){
	
	if(event.keyCode===13 || event.which===13){
			ctrlAddItem();
	}

})
	document.querySelector(doms.container).addEventListener('click',ctrlDeleteItem)

	document.querySelector(doms.getType).addEventListener('change',uiController.changeInput)

	}

	var updateBudget = function(){
			budgetController.calcBudget();


	    var budget = budgetController.getbudget()
	
	     uiController.budgetDisplay(budget);
	}

	var updatePercentages = function(){

		//1) calculate each percentage
		budgetController.calcPercentage();
		//2)read percentage from budget controller
		var exp_per_percentage = budgetController.getPercentage();
		

		//3)update percentage to the ui
		uiController.displayElmPercentage(exp_per_percentage)
	}


var ctrlAddItem = function(){

var input,newItem,uiNewItem,mon
	//1)get the value from the input field
	input =uiController.Values()

	//2)add the item to the budgetController

	if(input.description!==''&&!isNaN(input.value)&&input.value>0){

	newItem = budgetController.addItem(input.type,input.description,input.value )

	//3)add the item to the ui
	uiNewItem = uiController.addListItem(newItem,input.type);
	uiController.clearFields();
	updateBudget();
	updatePercentages();
	
	
	}

	    //3)display the budget to the ui
		//----------todo list------------

	//4)calculate and update the budget
}

var ctrlDeleteItem=function(event){
	var splitID,type,Id

	itemId = event.target.parentNode.parentNode.parentNode.parentNode.id
	if(itemId){

		splitID=itemId.split('-')
		Type=splitID[0]
		Id=Number(splitID[1])

		//1. delete the item from dataStructure
		budgetController.DeleteItemFromDs(Id,Type);

		//2. delete the item from ui
		uiController.deleteListitem(itemId)

		//3. update and show the budget
		updateBudget();
		updatePercentages();
	}

}

	return {
	init: function(){
		 setupEventListeners()
		 uiController.displayMonth(YearnMonth.perYear,YearnMonth.perMonth);
		 uiController.budgetDisplay({
			totalexpense:0,
			totalincome:0,
			budget:0,
			percentage:0
		})
	}
}

})(budgetController,uiController);


controller.init()

		
		





	

	
	





		
	








