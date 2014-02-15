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
            
            $scope.index = 0;
			
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
    
    $scope.test = function(e, index){
      console.log(localStorage);
        localStorage.setItem('test', 1);
    };
    
    $scope.onBlur = function(e, index){
        var  value = parseFloat($(e.target).text()) || 0;
        
        //doing this doesn't rerender the template :(
        //do you know how to rerender?
        $scope.lines[index].amount = value;
        //gotta do it by hand
        $(e.target).text(value);
    };
    
    $scope.modifyAmount = function(e, index){
        var  value = parseFloat($(e.target).text()) || 0;
        
        $scope.index = index;

        $scope.lines[index].amount = value;
        
    };
    
    $scope.delete = function(e, index){
        $scope.lines.splice(index, 1);
    };
    
    //this monitors total it's better than suming all lines at every change
    $scope.$watch(
        'lines',
        function(modified, original){
            if(modified !== original){
                if(modified.length > original.length){
                    //new line has been added
                    $scope.numericTotal += modified[$scope.index].amount;
                }else if(modified.length == original.length){
                    //line has been modified
                    $scope.numericTotal += - original[$scope.index].amount + modified[$scope.index].amount;
                }
                else{
                    //line has been deleted
                    $scope.numericTotal -= original[$scope.index].amount;
                }
         
                $scope.total = displayTotal();
            }            
        },
        true
    );
	
	$scope.lines = [];
});