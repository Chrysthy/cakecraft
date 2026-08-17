const navigation = document.getElementById("site-nav");

const revealElements = document.querySelectorAll(".reveal");

const heroVideo = document.querySelector(".hero__video");
const hero = document.querySelector(".hero");
const heroPanel = document.querySelector(".hero__panel");
const heroContent = document.querySelector(".hero__content");
const heroInfo = document.querySelector(".hero__info");
const heroArrow = document.querySelector(".hero__arrow");


/* =====================================
   NAVIGATION
===================================== */

if (navigation) {
    window.addEventListener("scroll", function () {

        if (window.scrollY > 50) {
            navigation.classList.add("site-nav--hidden");
        } else {
            navigation.classList.remove("site-nav--hidden");
        }

    });
}


/* =====================================
   REVEAL ELEMENTS
===================================== */

if (revealElements.length) {

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }

        });

    });

    revealElements.forEach(function (element) {
        observer.observe(element);
    });

}


/* =====================================
   VIDEO CONTROLLED BY SCROLL
===================================== */

if (
    window.gsap &&
    window.ScrollTrigger &&
    heroVideo &&
    hero &&
    heroPanel &&
    heroContent
) {

    gsap.registerPlugin(ScrollTrigger);


    const SCROLL_DISTANCE = 3500;

    const END_MARGIN = 0.05;

    heroVideo.muted = true;

    heroVideo.playsInline = true;

    heroVideo.setAttribute(
        "playsinline",
        "true"
    );

    heroVideo.removeAttribute(
        "autoplay"
    );

    heroVideo.removeAttribute(
        "loop"
    );

    heroVideo.loop = false;

    heroVideo.pause();


    let videoDuration = 0;

    let videoUnlocked = false;


    heroVideo.addEventListener(
        "play",
        function () {

            if (!videoUnlocked) {
                heroVideo.pause();
            }

        }
    );



    const saveVideoDuration = function () {

        if (
            heroVideo.duration &&
            Number.isFinite(
                heroVideo.duration
            )
        ) {

            videoDuration =
                heroVideo.duration;

            ScrollTrigger.refresh();

        }

    };


    if (heroVideo.readyState >= 1) {

        saveVideoDuration();

    } else {

        heroVideo.addEventListener(
            "loadedmetadata",
            saveVideoDuration,
            {
                once: true
            }
        );

    }


    const unlockVideo = function () {

        videoUnlocked = true;

        const playPromise =
            heroVideo.play();


        const stopVideo = function () {

            videoUnlocked = false;

            heroVideo.pause();

            updateVideoTime();

        };


        if (
            playPromise &&
            typeof playPromise.then ===
            "function"
        ) {

            playPromise
                .then(stopVideo)
                .catch(function () {

                    videoUnlocked = false;

                });

        } else {

            stopVideo();

        }

    };


    window.addEventListener(
        "pointerdown",
        unlockVideo,
        {
            once: true
        }
    );

    window.addEventListener(
        "touchstart",
        unlockVideo,
        {
            once: true
        }
    );


    const videoState = {
        time: 0
    };


    const updateVideoTime = function () {

        if (
            !videoDuration ||
            heroVideo.readyState < 1
        ) {

            return;

        }


        if (
            Math.abs(
                heroVideo.currentTime -
                videoState.time
            ) > 0.01
        ) {

            heroVideo.currentTime =
                videoState.time;

        }

    };


    /*
        ANIMAÇÃO PRINCIPAL
    */

    gsap.timeline({

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end:
                "+=" +
                SCROLL_DISTANCE,

            scrub: 1,

            pin: true,

            invalidateOnRefresh: true

        }

    })


        .to(
            heroVideo,
            {
                opacity: 1,
                duration: 0.15,
                ease: "none"
            },
            0
        )


        .to(
            [
                heroContent,
                heroInfo,
                heroArrow
            ],
            {
                opacity: 0,

                y: -40,

                scale: 0.6,

                duration: 0.1,

                ease: "none"
            },
            0.02
        )



        .fromTo(

            videoState,

            {
                time: 0
            },

            {

                time: function () {

                    return Math.max(
                        videoDuration -
                        END_MARGIN,
                        0
                    );

                },

                duration: 1,

                ease: "none",

                onUpdate:
                    updateVideoTime

            },

            0
        );

}