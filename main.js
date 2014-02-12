(function(window, $){
$(document).ready(function(){
    /*$('#form').on('submit', function(){
        var amount = $('#input').val().replace(/.*(\D)(\d+)\D*$/g, '$2');
        
        console.log(amount);
        
        
        return false;
    });*/
    
});
}(this, jQuery));

var cumulusApp = angular.module('cumulusApp', []);

cumulusApp.controller('calculateLines', function($scope){
    $scope.numericTotal = 0;
	$scope.total = $scope.numericTotal;
	
	$scope.submitInput = function(){	
		var matches = /(.*[^\.\d,])((\d+?[\.,]?)?\d+)\D*$/g.exec(this.input);

		if(matches !== null){
			var text = matches[1],
				amount = parseFloat(matches[2]),
				line = {
					text : text,
					amount : amount
				};
			
			$scope.lines.unshift(line);

			$scope.numericTotal += amount;
			
			$scope.total = $scope.numericTotal.toFixed(2);
			
			this.input = '';
		}
	
		return false;
	}
	
	$scope.modifyText = function(e){
		//e.target.contentEditable = true;
        console.log(e);
	};
    
    $scope.catchReturn = function(e){

        if(e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 8){
            return true;
        }
        
        if(e.keyCode == 13 || e.keyCode < 48 || e.keyCode > 57){
            e.preventDefault();
        }
    }
    
    $scope.initChange = function(e){
         var index = $(e.target).parent('li').attr('id'),
            original = parseFloat($scope.lines[index].amount);
        
        $scope.totalToModify = $scope.numericTotal - original;
    };
    
    $scope.modifyAmount = function(e){
        var index = $(e.target).parent('li').attr('id'),
            original = parseFloat($scope.lines[index].amount),
            value = parseFloat($(e.target).text());
        
     
        
        $scope.numericTotal += - original + value;
        
        $scope.total = $scope.numericTotal.toFixed(2);
        $scope.lines[index].amount = value;
        console.log($scope.lines[index]);
        
    };
	
	$scope.lines = [];
});