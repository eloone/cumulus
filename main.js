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
	$scope.total = displayTotal();
	
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
			
			$scope.total = displayTotal();
			
			this.input = '';
		}
	
		return false;
	}

    function displayTotal(){
        return $scope.numericTotal.toFixed(2);
    }
    
    $scope.keyStack = [];
    
    $scope.filterKeys = function(e){

        //left/right/backspace
        var allowed = [39, 37, 8],
            //ctrl/cmd
            combined = [91, 17];
        
        if(allowed.indexOf(e.keyCode) > -1){
            return true;
        }
        
        if(combined.indexOf(e.keyCode) > -1){
            //we have to put keycode on a stack to remember it in ctrl+A case
            $scope.keyStack.push(e.keyCode);
            return true;
        }
        
        //enter
        if(e.keyCode == 13){
            e.preventDefault();
        }
        
        //non digit
        if(e.keyCode < 48 || e.keyCode > 57){
            if($scope.keyStack.join(' ').match(/91|17/g)){
                $scope.keyStack.shift();
                return true;
            }else{
                e.preventDefault();
            }            
        } 
       
    };
    
    $scope.filterReturn = function(e){
        //enter
        if(e.keyCode == 13){
            e.preventDefault();
        }
    };
    
    $scope.onBlur = function(e){
         var index = $(e.target).parent('li').attr('id'),
             value = parseFloat($(e.target).text()),
             original = $scope.lines[index].amount;
        
        if(isNaN(value)){
            value = 0;
            //find a way to use this with angular to update total
            $scope.lines[index].amount = value;
            //gotta do it by hand
            $(e.target).text(value);      
        }
        
        $scope.numericTotal += - original + value;
        
        $scope.total = displayTotal();

    };
    
    $scope.modifyAmount = function(e){
        var index = $(e.target).parent('li').attr('id'),
            original = $scope.lines[index].amount,
            value = parseFloat($(e.target).text());

        if(isNaN(value)){
            value = 0;
        }
        
        $scope.numericTotal += - original + value;
        
        $scope.total = displayTotal();
        $scope.lines[index].amount = value;
        
    };
    
    //use this to monitor total
    $scope.$watch(
  // This is the listener function
    function() { return $scope.lines; },
    function(modified, original){
        console.log(arguments);
        },
        true
    );
	
	$scope.lines = [];
});