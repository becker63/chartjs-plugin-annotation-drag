1. everytime the mouse updates a function called ***updateListeners*** is called with 3 variables passed to it, these are passed everywhere throughout the lib:
    1. state: whether the annotation line has been clicked on or moved over 
    2. args.event: what event has been detected
    3. options: chart options

2. this does some stuff to check in your annotation options what event you have selected to detect

3. then a function called ***handleEvent*** is called with the same options passed as updatelistener

4. ***handleEvent*** sends you off to one of 2 functions depending on if its a mouseover or click: ***handleMoveEvents*** and ***handleClickEvents***.  ***handleMoveEvents*** is a little weirder but it all ends up going to what you see in step 4

5. **MORE WORK NEEDED**: both ***handleMoveEvents*** and ***handleClickEvents*** pass a parameter to a function called ***getElements*** called **options.interaction** depending on the type of event (mouseover or mouseclick). These find whatever element the user is selecting and depending on this element the method to find that will be diffrent, for example 'mouseclick' does a 'getnearest' mode. Problem is I have no idea where this 'interaction' param is being generated.

6. Now with what annotation the user has touched from ***getElements*** which executes the function found in there annotation options, and allows you to pass along the options of your chart to be changed.
