const init = function() {
    const imagesList = document.querySelectorAll('.gallery__item');
    imagesList.forEach( img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    });

    runJSSlider();
}

document.addEventListener('DOMContentLoaded', init);


const runJSSlider = function() {
    const imagesSelector = '.gallery__item';
    const sliderRootSelector = '.js-slider';

    const imagesList = document.querySelectorAll(imagesSelector);
    const sliderRootElement = document.querySelector(sliderRootSelector);

    initEvents(imagesList, sliderRootElement);
    initCustomEvents(imagesList, sliderRootElement, imagesSelector);
}


const initEvents = function(imagesList, sliderRootElement) {
    imagesList.forEach( function(item)  {
        item.addEventListener('click', function(e) {
            fireCustomEvent(e.currentTarget, 'js-slider-img-click');
        });
    });

    const navNext = sliderRootElement.querySelector('.js-slider__nav--next');

    navNext.addEventListener('click' , function(e) {
        fireCustomEvent(e.target , 'js-slider-img-next');
        e.stopPropagation();
    })

    navNext.addEventListener('mouseenter' ,  imgChangerStop)
    navNext.addEventListener('mouseleave' ,  imgChangerStart);

    const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');

    navPrev.addEventListener('click' , function(e) {
        fireCustomEvent(e.target , 'js-slider-img-prev');
        e.stopPropagation();
    })

    navPrev.addEventListener('mouseenter' ,  imgChangerStop);
    navPrev.addEventListener('mouseleave' ,  imgChangerStart);


    const zoom = sliderRootElement.querySelector('.js-slider__zoom');

    zoom.addEventListener('click' , function(e) {
        if(e.target === e.currentTarget) {
            fireCustomEvent(e.target , 'js-slider-close');
        }
    })

}


const fireCustomEvent = function(element, name) {
    console.log(element.className, '=>', name);

    const event = new CustomEvent(name, {
        bubbles: true,
    });

    element.dispatchEvent( event );
}


const initCustomEvents = function(imagesList, sliderRootElement, imagesSelector) {
    imagesList.forEach(function(img) {
        img.addEventListener('js-slider-img-click', function(event) {
            onImageClick(event, sliderRootElement, imagesSelector);
        });
    });

    sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
    sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
    sliderRootElement.addEventListener('js-slider-close', onClose);
}


const onImageClick = function(event, sliderRootElement, imagesSelector) {
    sliderRootElement.classList.add('js-slider--active');

    const clickedImgSrc = event.target.children[0].getAttribute('src');

    sliderRootElement.querySelector('img').setAttribute('src' , clickedImgSrc);

    const groupName = event.target.dataset.sliderGroupName;
    const identicalGroupName = document.querySelectorAll(imagesSelector + '[data-slider-group-name=' + groupName +']');
    const sliderThumb = getSliderThumb();

    for(let i=0; i<identicalGroupName.length; i++) {
        sliderThumb.appendChild(identicalGroupName[i].cloneNode(true));
        sliderThumb.children[i+1].lastElementChild.remove()
    }

    sliderRootElement.querySelector('img').classList.add('js-slider__thumbs-image--current');

    imgChangerStart();
}

const onImageNext = function(event) {
    console.log(event)
    const currentElementSrc = getCurrentImgSrc();
    const sliderThumbImgList = getSliderThumbImgList();
    const currentElement = getCurrentElement(sliderThumbImgList, currentElementSrc)
    const nextElement = getNextElement(currentElement);

    nextElement === null ? setFirstImgSrc() : setNextImgSrc(nextElement)
}

const onImagePrev = function(event) {
    console.log(event)

    const currentElementSrc = getCurrentImgSrc();
    const sliderThumbImgList = getSliderThumbImgList();
    const currentElement = getCurrentElement(sliderThumbImgList, currentElementSrc)
    const prevElement = getPrevElement(currentElement)

    prevElement.classList.contains('js-slider__thumbs-item--prototype') ? setLastImgSrc() : setPrevImgSrc(prevElement)
}

const onClose = function(event) {
    console.log(this, 'onClose')

    document.querySelector('.js-slider--active').classList.remove('js-slider--active');

    const sliderThumb = getSliderThumb();
    const sliderThumbChildrenArray = Array.from(sliderThumb.children)

    sliderThumbChildrenArray.forEach( function(el) {
        if( !el.classList.contains('js-slider__thumbs-item--prototype') ) {
            sliderThumb.removeChild(el);
        }
    })

    imgChangerStop();
}


const getCurrentImgSrc = function() {
    const currentElementSrc = document.querySelector('.js-slider__thumbs-image--current').getAttribute('src');
    return currentElementSrc;
}

const getSliderThumbImgList = function() {
    const sliderThumbImgList = getSliderThumb().querySelectorAll(`img`);
    return sliderThumbImgList;
}

const getSliderThumb = function() {
    return document.querySelector('.js-slider__thumbs')
}

const getCurrentElement = function(sliderThumbImgList, currentElementSrc) {
    const sliderThumbImgListArray = Array.from(sliderThumbImgList)

    return sliderThumbImgListArray.find( function(el) {
        if(el.getAttribute('src') === currentElementSrc) {
            el.classList.add('js-slider__thumbs-image--current');
            return el
        }
    })
}

const getNextElement = function(currentElement) {
    const nextElement = currentElement.parentElement.nextElementSibling;
    return nextElement
};

const getPrevElement = function(currentElement) {
    const previousElement = currentElement.parentElement.previousElementSibling;
    return previousElement
}

const setFirstImgSrc = function() {
    const firstImgSrc = document.querySelector('.js-slider__thumbs .gallery__item img').getAttribute('src');
    const mainImg = getMainImg().setAttribute('src' , firstImgSrc);
}

const setNextImgSrc = function(nextElement) {
    const nextImgSrc = nextElement.querySelector('img').getAttribute('src');
    const mainImg = getMainImg().setAttribute('src' , nextImgSrc);
}

const setPrevImgSrc = function(prevElement) {
    const prevImgSrc = prevElement.querySelector('img').getAttribute('src');
    const mainImg = getMainImg().setAttribute('src' , prevImgSrc);
}

const setLastImgSrc = function() {
    const lastImgSrc = document.querySelector('.js-slider__thumbs .gallery__item:last-child img').getAttribute('src');
    const mainImg = getMainImg().setAttribute('src' , lastImgSrc);
}

const getMainImg = function() {
    const mainImg = document.querySelector('.js-slider__image');
    return mainImg;
}

let interval;

const imgChangerStart = function() {
    interval = setInterval(onImageNext,2000);
}

const imgChangerStop = function() {
    clearInterval(interval);
}