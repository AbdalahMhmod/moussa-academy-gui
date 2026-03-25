$(document).ready(function () {
    var topNav = $('#top__nav');
    var mainNav = $('#mainNav');
    var secondNav = $('#secondNav');
    var toggleIcon = $('#mobile_list');

    var topHeight = topNav.outerHeight();

    function updateNavs() {
        if ($(window).width() < 992) {
            mainNav.hide();
            secondNav.show();
        } else {
            mainNav.show();
            secondNav.hide();
        }
    }

    updateNavs();

    $(window).resize(function () {
        updateNavs();
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > topHeight) {
            topNav.addClass('hidden');
            mainNav.addClass('fixed-nav');
        } else {
            topNav.removeClass('hidden');
            mainNav.removeClass('fixed-nav');
        }
    });

    toggleIcon.click(function () {
        if ($(window).width() < 992) {
            mainNav.fadeToggle(200);
            secondNav.fadeToggle(200);
        } else {
            if (mainNav.is(':visible')) {
                mainNav.fadeOut(200);
                secondNav.fadeIn(200);
            } else {
                mainNav.fadeIn(200);
                secondNav.fadeOut(200);
            }
        }
    });

    $('.flag-item').click(function (e) {
        e.preventDefault();
        var flagSrc = $(this).data('flag');
        $('#currentFlag').attr('src', flagSrc);
    });
    $('#floating_w_btn').hide();
    $('#floating_t_btn').hide();

    $('#floating_btn').click(function () {
        $('#floating_w_btn').fadeToggle(200);
        $('#floating_t_btn').fadeToggle(200);
    });

    $('#playVideo').on('click', function () {
        $('#videoPreview').hide();
        $(this).hide();

        $('#videoFrameHolder').attr(
            'src',
            'https://www.youtube.com/embed/DSCg9CW3Ufk?autoplay=1&rel=0'
        );

        $('#videoFrame').removeClass('d-none');
    });

    $('#universityForm').submit(function (e) {
        e.preventDefault();

        var url = $('#universitySelect').val();

        if (url) {
            window.location.href = url;
        }
    });

    //course slider
    document.querySelectorAll('.slider-wrapper').forEach(wrapper => {

        const sliderTrack = wrapper.querySelector('.slider-track');
        const courses = wrapper.querySelectorAll('.course-card');
        const nextArrow = wrapper.querySelector('.left-arrow');   // next in RTL
        const prevArrow = wrapper.querySelector('.right-arrow');  // prev in RTL
        const sliderContainer = wrapper.querySelector('.slider-container');

        let currentIndex = 0;

        function getVisibleCards() {
            return Math.floor(sliderContainer.offsetWidth / 270);
        }

        const totalCards = courses.length;

        function updateSlider() {

            const visibleCards = getVisibleCards();
            const maxIndex = totalCards - visibleCards;

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const cardWidth = courses[0].offsetWidth + 20; // gap

            const offset = currentIndex * cardWidth;

            sliderTrack.style.transform = `translateX(${offset}px)`;
        }

        nextArrow.addEventListener('click', e => {
            e.preventDefault();
            currentIndex++;
            updateSlider();
        });

        prevArrow.addEventListener('click', e => {
            e.preventDefault();
            currentIndex--;
            updateSlider();
        });

        window.addEventListener('resize', updateSlider);

        updateSlider();

    });

    //uni slider
    document.querySelectorAll('.university-slider').forEach(wrapper => {

        const track = wrapper.querySelector('.uni-slider-track');
        const cards = wrapper.querySelectorAll('.uni-card');
        const next = wrapper.querySelector('.next');
        const prev = wrapper.querySelector('.prev');
        const dotsContainer = wrapper.parentElement.querySelector('.uni-dots');

        let index = 0;
        const cardWidth = 205;

        // عدد الكروت الظاهرة
        const visibleCards = Math.floor(wrapper.offsetWidth / cardWidth);
        const maxIndex = Math.max(0, cards.length - visibleCards);

        /* ===== dots ===== */

        dotsContainer.innerHTML = "";

        cards.forEach((_, i) => {
            const dot = document.createElement('span');

            if (i === 0) dot.classList.add('active');

            dotsContainer.appendChild(dot);

            dot.addEventListener('click', () => {
                index = Math.min(i, maxIndex);
                update();
            });
        });

        function update() {

            // ✅ RTL → الاتجاه موجب
            track.style.transform = `translateX(${index * cardWidth}px)`;

            const dots = dotsContainer.querySelectorAll('span');
            dots.forEach(d => d.classList.remove('active'));

            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }

        /* ===== arrows ===== */

        next.addEventListener('click', () => {
            index++;
            if (index > maxIndex) index = 0;
            update();
        });

        prev.addEventListener('click', () => {
            index--;
            if (index < 0) index = maxIndex;
            update();
        });

        /* ===== drag ===== */

        let isDown = false;
        let startX = 0;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX;
        });

        track.addEventListener('mouseleave', () => isDown = false);
        track.addEventListener('mouseup', () => isDown = false);

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;

            const walk = e.pageX - startX;

            // ✅ RTL drag directions reversed
            if (walk > 50) {
                next.click(); // اسحب يمين → التالي
                isDown = false;
            }

            if (walk < -50) {
                prev.click(); // اسحب شمال → السابق
                isDown = false;
            }
        });

        /* ===== autoplay ===== */

        let autoPlay = setInterval(() => {
            next.click();
        }, 4000);

        wrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
        wrapper.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => next.click(), 4000);
        });

    });

    document.querySelectorAll('.instructor-slider').forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        // ===== Helper Function =====
        const startDrag = (x) => {
            isDown = true;
            startX = x - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const moveDrag = (x) => {
            if (!isDown) return;
            const walk = (x - startX) * 1.5;
            slider.scrollLeft = scrollLeft - walk;
        };

        const stopDrag = () => {
            isDown = false;
        };

        // ===== Mouse Events =====
        slider.addEventListener('mousedown', (e) => startDrag(e.pageX));
        slider.addEventListener('mousemove', (e) => moveDrag(e.pageX));
        slider.addEventListener('mouseup', stopDrag);
        slider.addEventListener('mouseleave', stopDrag);

        // ===== Touch Events =====
        slider.addEventListener('touchstart', (e) => startDrag(e.touches[0].pageX));
        slider.addEventListener('touchmove', (e) => moveDrag(e.touches[0].pageX));
        slider.addEventListener('touchend', stopDrag);
    });

    const reviews = {
        "1.jpg": "منصة موسى ساعدتني جدًا في فهم المواد بطريقة بسيطة وسهلة ❤️",
        "2.jpg": "أفضل منصة تعليمية جربتها.",
        "3.jpg": "الدروس منظمة وسهلة الفهم.",
        "4.jpg": "وفرت علي وقت كبير جدًا.",
        "5.jpg": "تجربة ممتازة وأنصح بها.",
        "6.jpg": "شرح احترافي وسلس.",
        "7.jpg": "ساعدتني أحقق درجات عالية.",
        "8.jpg": "من أفضل المنصات التعليمية."
    };

    function changeReview(el) {
        const src = el.getAttribute("src");
        const fileName = src.split('/').pop();

        document.getElementById("mainImage").src = src;
        document.getElementById("reviewText").innerText = reviews[fileName];
    }

    const counters = document.querySelectorAll('.counter');

    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let count = 0;

        const update = () => {
            const increment = target / 100;

            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count).toLocaleString();
                setTimeout(update, 20);
            } else {
                counter.innerText = "+" + target.toLocaleString();
            }
        };

        update();
    };

    // Run when visible (optional تحسين)
    let started = false;

    window.addEventListener('scroll', () => {
        const section = document.querySelector('.counters');
        const sectionTop = section.getBoundingClientRect().top;

        if (!started && sectionTop < window.innerHeight) {
            counters.forEach(startCounter);
            started = true;
        }
    });








});