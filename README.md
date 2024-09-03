# Custom Multiplication Tables

A website where the user can create thier own custom multiplication table.
The end-user is able to:
- Define the start and end values of the table (both columns and rows)
- Use negative and/or decimal numbers
- Have the browser or server calculate and create the table
- Can display the table with ascending and/or descending numbers

# Technical info:
- Multiplication tables are calculated and created in real time after form submission
- For example, if "My device" (Javascript) is selected, the numbers of each cell in the table are going to be individually multiplied to get the correct result and then wraped in the appropiate HTML table element
- End-users have the option to either use Javascript or PHP to create the tables but note that PHP files must be located on the back-end otherwise the "Server" option won't work
- If PHP is selected, Javascript calls out to the PHP script with the end-user's desired table data. After PHP is done calculating the table Javascript will get a response back with the HTML table ready for Javascript to display

