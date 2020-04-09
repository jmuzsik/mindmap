# How will i implement search

I need search capability.

I have an overarching idea of how to accomplish this.

1. Whenever a user inputs their notes, journal entry, or any other text-based content I will alter a file associated with the user. This file will be connected to the subject.
   1. The text will have a character limit. Once that character limit is reached (I will do 5 mb limit) then I will let the user know that search will only work for the most recent 5mb of data.
2. This file will be fetched from the backend at one instance and stored in the user's localStorage. 
   1. This storage must happen asynchronously as it is a big load to request from the database. 
   2. It should also be appended to local storage when the user saves.
   3. I must run a chron job that runs, say 3 times a day that will update the users file.
   4. So only update the actual file during those times. Get it and append data to it while the user uses the app.
3. Perhaps use this: https://github.com/farzher/fuzzysort
4. There is more but it does not come immediately to mind 