var cumulusApp = angular.module('cumulusApp', []);

cumulusApp.controller('headerCtrl', function($scope){
     $scope.$on('istyping', function(thisEvent){
        $('#saved-svg').attr('class', 'saved-graphic typing');
        //added to fix a rendering pb on chrome to render svg with a class
        //the style of the svg without the class is still visible
        $('.saved-status').addClass('typing');
     });

     $scope.$on('issaved', function(thisEvent){
        $('#saved-svg').attr('class', 'saved-graphic');
        $('.saved-status').removeClass('typing');
     });
});

cumulusApp.controller('linesCtrl', function($scope, $rootScope){
    var lines = [];

    //localStorage.clear();
    if(localStorage){
        lines = JSON.parse(localStorage.getItem('lines')) || [];
    }

    $scope.numericTotal = 0;
	$scope.total = displayTotal();    	
	$scope.lines = lines;

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
    
    $scope.filterKeys = function(e){
        //left/right/backspace
        var allowed = [39, 37, 8];
        
        if(allowed.indexOf(e.keyCode) > -1 || (e.ctrlKey || e.metaKey)){
            return true;
        }
        
        //enter or non digit
        if(e.keyCode == 13 || (e.keyCode < 48 || e.keyCode > 57)){
            e.preventDefault();
        }
       
    };
    
    $scope.filterReturn = function(e){
        //enter
        if(e.keyCode == 13){
            e.preventDefault();
        }
    };
    
    $scope.onBlur = function(e, index){
        var  value = parseFloat($(e.target).text()) || 0;
        
        //doing this doesn't rerender the template :(
        //do you know how to rerender?
        $scope.lines[index].amount = value;
        //gotta do it by hand
        $(e.target).text(value);
        
        $scope.$emit('save');
    };
    
    $scope.modifyAmount = function(e, index){
        var  value = parseFloat($(e.target).text()) || 0;

        $scope.index = index;

        $scope.lines[index].amount = value;
        
    };
    
    $scope.modifyText = function(e, index){
        var  value = $(e.target).text();
         
        $scope.index = index;

        $scope.lines[index].text = value;       
    };

    $scope.$on('typing', function(thisEvent, domEvent){
        if(!localStorage){
            return;
        }

        $rootScope.$broadcast('istyping');
        
        $(domEvent.currentTarget).addClass('unsaved');

        if(domEvent.ctrlKey || domEvent.metaKey){
            if(domEvent.keyCode == 83){
                //prevents ctrl+s saving
                domEvent.preventDefault();
                
                $scope.$emit('save');
            }
        }
        
    });
    
     $scope.$on('save', function(thisEvent, domEvent){  
        if(!localStorage){
            return;
        }

        $rootScope.$broadcast('issaved');

        //i don't trust saving the total in db..
        localStorage.setItem('lines', JSON.stringify($scope.lines));
         
        $('.unsaved').removeClass('unsaved');
    });
    
    $scope.delete = function(e, index){
        $scope.lines.splice(index, 1);
        $scope.index = index;
    };
    
    //this monitors total it's better than suming all lines at every change
    $scope.$watch(
        'lines',
        function(modified, original){
            if(modified !== original){
                if(modified.length > original.length){
                    //new line has been added
                    $scope.numericTotal += modified[$scope.index].amount;
                    $scope.$emit('save');
                }else if(modified.length == original.length){
                    //line has been modified
                    $scope.numericTotal += - original[$scope.index].amount + modified[$scope.index].amount;
                }
                else{
                    //line has been deleted
                    $scope.numericTotal -= original[$scope.index].amount;
                    $scope.$emit('save');
                }
  
            }else{
                //at page load
                for(var i = 0; i < $scope.lines.length; i++){
                    $scope.numericTotal += $scope.lines[i].amount;
                }
            }
            
            $scope.total = displayTotal();
        },
        true
    );

});
