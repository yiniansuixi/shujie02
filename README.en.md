# Medical Equipment Product Catalog Website

A medical equipment product showcase website developed using pure HTML, CSS, and JavaScript. This project is used to display various medical devices and surgical robot products, providing product categorization, filtering, detail viewing, and favorites functionality.

## Project Structure

```
my-site/
├── index.html          # Main page HTML structure
├── app.js              # JavaScript application logic
├── style.css           # Stylesheet
├── data.json           # Product data
└── assets/             # Image resources
    ├── *.jpg, *.webp, *.png  # Product images
    └── .keep
```

## Main Features

### Product Display
- **Product Module**: Displays medical equipment and surgical robot products
- **Technology Module**: Displays relevant technical information
- **Pain Points Module**: Displays industry challenges and demands
- **Design Module**: Displays design analysis and innovations

### Interaction Features
- **Category Filtering**: Filter products by type
- **Tab Navigation**: Supports tab switching and sub-tag filtering
- **Product Favorites**: Click the bookmark icon to save products of interest
- **Detail Modal**: Click product cards to view detailed information
- **Image Load Failure Handling**: Automatically fallback to placeholder image

### Interface Features
- Responsive design, adapting to different screen sizes
- Modern card-style layout
- Top navigation and anchor links
- Toast notification messages
- Dark/Light theme support (via CSS variables)

## Usage

1. **Local Run**:
   ```bash
   # Use any static server
   npx serve .
   # Or use Python
   python -m http.server 8000
   # Or directly open index.html in browser
   ```

2. **Data Configuration**:
   Edit the `data.json` file to add or modify product data

3. **Add New Products**:
   - Add product entries in `data.json`
   - Place product images in the `assets/` directory
   - Update corresponding image references

## Tech Stack

- **HTML5**: Semantic tag structure
- **CSS3**: Custom properties, Flexbox, Grid layout
- **JavaScript (ES6+)**: Native JS, no framework dependencies

## Browser Support

- Chrome / Edge (Latest versions)
- Firefox (Latest versions)
- Safari (Latest versions)

## License

MIT License