'use strict'
describe('calculator page', function(){
    browser.get('http://localhost:3000/');
    var output = element(by.binding('output')); 
    var players = element.all(by.css('.list-group-item'));
    var firstPlayer = element(by.css('.list-group-item'));
    var title = element(by.css('.title'));
    var updateButton = element(by.id('updateGame'));
    var button5 = element(by.id('calc-5'));

    it('should be able to get to the calculator screen', function(){
        // see if the title is there
        expect(title.getText()).toBe('Power Grid');
        // see if all the players are there
        expect(firstPlayer.getText()).toBe('Andrei\n$50.00');
        //click on the first player
        firstPlayer.click();
        //it should load the calculator page
        expect(output.getText()).toBe('0');
    });

    it('should be able to add numbers to the output', function(){
        //press on the number 5 button
        button5.click();
        expect(output.getText()).toBe('5');
        //click it again
        button5.click();
        expect(output.getText()).toBe('55');

    })

    it("should be able to update the players score", function(){
        // click on the update button  
        updateButton.click();
        // the players money should be updated
        expect(firstPlayer.getText()).toBe('Andrei\n$105.00')
    });

});
