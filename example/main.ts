import data from 'test.computed';
import image from 'image.computed';

console.log(data, image);
document.querySelector('img')?.setAttribute('src', image);
