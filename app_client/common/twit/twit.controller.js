(function () {

angular
	.module('mtcApp')
	.controller('twitCtrl', twitCtrl);

twitCtrl.$inject = ['$http', '$timeout'];

	function twitCtrl ($http, $timeout) {
		this.$onInit = function() {
		var vm = this;
		vm.groupReply = [];
		vm.nameAdded = [];
		vm.add = "";
		vm.replyTo ="";
		vm.name ="";
		vm.message = {};
		vm.isLoading = false;
		vm.namePresent ="";


		vm.addGroupReply = function(name, id) {
			var obj = {"name":name, "id":id};
			vm.groupReply.push(obj);
			vm.nameAdded.push(name);
			vm.replyTo = vm.groupReply.toString();
			vm.name = vm.groupReply[vm.groupReply.length - 1].name;
			vm.id = vm.groupReply[vm.groupReply.length - 1].id;
		};

		vm.onSubmit = function () {
			vm.formError = "";
			if(!vm.formData.tweet) { 
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				var data = vm.formData;
				vm.callTweet(data);
			}
		};

		vm.today = function() {
		    vm.date = new Date();
		  };
		vm.today();

		vm.clear = function() {
		    vm.date = null;
		};

		vm.format = 'yyyy-MM-dd';
		

		vm.getTwitter = function(text, date) {
			vm.isLoading = true;
			return $http({
				url: "/api/twit",
				method: "GET",
				params: {
					text: text,
					date: date
				}
			}).
			then(function(data) {
				if (data) {
					vm.data = { twit: data};
				} else {
					console.log("Something wrong")
				}
				vm.isLoading = false;
			})
			.catch(function (e) {
				console.log(e);
				vm.isLoading = false;
			});
		};

		vm.callTweet = function(formData) {
			var data = vm.formData;
			postTwitter({
				tweet: formData.tweet,
				name : vm.name,
				id: vm.id
			}).
			then(function(success) {
				vm.message.success = true;
				$timeout(function () {
				    vm.message.success = false;
				}, 1000);
			})
			.catch(function (e) {
				console.log(e);
				vm.formError = "Something wrong! Tweet not sent."
			});
		};

		var postTwitter = function(data) {
			return $http.post('/api/tweet', data)	
		};
	}
};
})();