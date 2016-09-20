#User manual#

The division of structure and content allows the developer to modify the tutorial without actually making a change in the code. To manage the content, add new steps or change the requested user-input there is an external html file called "frames.html", which is being read by the Javascript.

Every "frame" (every individual step in the tutorial is referred to as "frame") has their own tag/paragraph in which the frame itself can be modified. It is possible to adjust

1. The explanation, the task and the headline using the corresponding tags `<explanation>`, `<task>` and `<headline>`

2. The position of the textbox via `<textposition>`; the values in the tags `<x>` and `<y>` move the middle of the textbox from the upper-left corner into the desired position. The inserted numbers define by how many percent of the screen the box is moved.

3. The alignment of any text using the tags `<left>`, `<right>` and `<center>`.

4. The object of interest, which is the highlighted element from the original website, using the tag `<objectOfInterest>`. To do this, the ID of the desired element has to be copied into the tags. The ID can be found using the search function of the console that is part of the browser.

5. The task the user has to fulfill in order to advance in the tutorial by using the tag `<taskDoneValue>`. Since the script compares the "taskDoneValue" with the value that is currently attributive to the object of interest, the correct taskDoneValue has to be taken from the original website, just like with `<objectOfInterest>`. 

In case  one is tracking a button, and the user should only be able to continue by clicking it, the attribute "button" of `<objectOfInterest>` has to be set to true; it will look like this: `<objectOfInterest button="true" textbox="false">`. 

In case one is tracking an input of the type 'text' and the user has to enter a string to continue, the attribute "textbox" of `<objectOfInterest>` has to be set to true; it will look like this: `<objectOfInterest button="false" textbox="true">`.

A frame could look like this:
```html
<frame number="16">
  <headline>
    <center>Example</center>
  </headline>
  <explanation>
    <left>Exampletext</left>
  </explanation>
  <task>
    <right>Exampletask</right>
  </task>
  <objectOfInterest button="true">#newid</objectOfInterest>
  <taskDoneValue></taskDoneValue>
</frame>
```
The file also contains a default setting which is set using the tag `<default>`.
Please note that it is very important to not type a space or a break in empty tags, as this will cause errors. One is advised to proceed as it is shown with `<taskDoneValue>` in the example above.
