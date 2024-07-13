
# Yelp Camp
Yelp Clone that allows users to post campgrounds as well as review other campgrounds posted by users.


## Requirements
An Unsplash and Cloudinary API key is needed to seed the database as well as store campground images.
## Installation


Clone the repository 
```bash
  git clone https://github.com/RickyS1ngh/YelpCamp.git

```
Navigate to the project directory
```bash
  cd YelpCamp

```
Install Dependices
```bash
 npm install
```

    
##  Setup
To run this project, you will need to create a .env file in the root directory and add the following enviromental variables with their assoicated values to the .env file.

`UNSPLASH_ACCESS_KEY `

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_KEY`

`CLOUDINARY_SECRET`

`MAPBOX_TOKEN`

After setting up the enviromental variables, you need to seed the database:
```bash
node seeds/index
```
This command will seed the database with campgrounds.

## Screenshots
<img width="1439" alt="Screenshot 2024-07-13 at 4 18 27 PM" src="https://github.com/user-attachments/assets/a0250dc2-cd46-43c6-bf05-8eb82fce4058">
<img width="1440" alt="Screenshot 2024-07-13 at 4 23 42 PM" src="https://github.com/user-attachments/assets/e6421e8b-33c8-4cf2-bcb1-fac3d7ebb733">
<img width="1440" alt="Screenshot 2024-07-13 at 4 18 49 PM" src="https://github.com/user-attachments/assets/db5023eb-1f65-4b12-9928-6b73ef8667f8">
<img width="1440" alt="Screenshot 2024-07-13 at 4 24 34 PM" src="https://github.com/user-attachments/assets/bb688e7d-7d2f-4e33-93d5-07c86f5df85a">
<img width="1440" alt="Screenshot 2024-07-13 at 4 20 44 PM" src="https://github.com/user-attachments/assets/fdc7f7d1-d3da-4efd-96e3-809c823fd8b9">




