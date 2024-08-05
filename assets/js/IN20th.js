// Common
const now = new Date();

// Enable tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// BGM
const bgm = document.getElementById('bgm');
const bgmSimple = document.getElementById('bgm-simple');
bgm.volume = 0;
bgm.load();
bgmSimple.volume = 1;
bgmSimple.load();
bgmSimple.addEventListener('play', () => {
    const slideUpBgmElements = document.querySelectorAll('.slide-up-bgm');
    slideUpBgmElements.forEach(element => {
        element.classList.add('visible');
    });
});

// img max-height
const setImgsMaxHeight = () => {
    const imgWrappers = document.querySelectorAll('.img-wrapper');
        imgWrappers.forEach(wrapper => {
            const imgs = wrapper.querySelectorAll('.img');
            const vh = window.innerHeight * 0.6;
            imgs.forEach(img => {
                img.style.maxHeight = `${Math.min(vh, 1400)}px`;
            });
    });
};
window.addEventListener('load', setImgsMaxHeight);
window.addEventListener('resize', setImgsMaxHeight);

// Load

let sectionElements;
let lastVideoIndex = 1;
let simpleBgmSelected = true;
window.addEventListener('load', (event) => {
    console.log('Welcome to TH IN 20th Anniversary Collaboration.\nPlease refrain from redistributing the artworks without permission. Thank you! 😇');

    // scale-x
    const scaleXElements = document.querySelectorAll('.scale-x');
    const updateScaleX = () => {
        const lowH = window.innerHeight * 0.6;
        scaleXElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (0 < rect.bottom && rect.top < lowH) {
                element.style.opacity = '1';
                element.style.transform = 'scaleX(1)';
            } else if (rect.bottom < -100 || window.innerHeight < rect.top) {
                element.style.opacity = '0';
                element.style.transform = 'scaleX(0)';
            }
        });
    };
    window.addEventListener('scroll', updateScaleX);
    window.addEventListener('resize', updateScaleX);

    // left-in / right-in
    const leftInElements = document.querySelectorAll('.left-in');
    const rightInElements = document.querySelectorAll('.right-in');
    const updateScroll = () => {
        const lowH = window.innerHeight * 0.6;
        leftInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (0 < rect.bottom && rect.top < lowH) {
                element.style.transform = 'translateX(0vw)';
            } else if (rect.bottom < -100 || window.innerHeight < rect.top) {
                element.style.transform = 'translateX(-100vw)';
            }
        });
        rightInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < lowH) {
                element.style.transform = 'translateX(0vw)';
            } else if (rect.bottom < -100 || window.innerHeight < rect.top) {
                element.style.transform = 'translateX(100vw)';
            }
        });
    };
    window.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);

    // section
    const sections = [
        { id: 'title', n: 4 },
        { id: 'prologue', n: 4 },
        { id: 'team-boundary', n: 2 },
        { id: 'team-magic', n: 2 },
        { id: 'team-scarlet', n: 2 },
        { id: 'team-ghost', n: 2 },
        { id: 'stage-1', n: 1 },
        { id: 'stage-2', n: 2 },
        { id: 'stage-3', n: 3 },
        { id: 'stage-4A', n: 4 },
        { id: 'stage-4B', n: 4 },
        { id: 'stage-5', n: 5 },
        { id: 'stage-6B', n: '6b' },
        { id: 'stage-EX', n: 'ex' },
        { id: 'contributors', n: 'ex' },
        { id: 'epilogue', n: 'ex' },
    ];
    const refreshSectionElements = () => {
        sectionElements = sections.map((section, index) => {
            const element = document.getElementById(section.id);
            const rect = element.getBoundingClientRect();
            return {
                ...section,
                top: rect.top,
                bottom: rect.bottom,
            };
        });
    };
    refreshSectionElements();
    window.addEventListener('scroll', refreshSectionElements);
    window.addEventListener('resize', refreshSectionElements);
    
    // Update BG video
    const videoElement = document.getElementById('bg-video');
    const videoElement2 = document.getElementById('bg-video-2');
    const updateBgVideo = () => {
        const scroll = window.innerHeight * 0.8;
        for (let section of sectionElements) {
            if (scroll < section.bottom) {
                changeVideo(section.n);
                return;
            }
        }
        changeVideo(4);
    };
    const changeVideo = (n) => {
        const lastVideo = lastVideoIndex == 1 ? videoElement2 : videoElement;
        const lastSrc = lastVideo.querySelector('source').getAttribute('src');
        const newSrc = `/assets/IN20th/bg-${n}.webm`;
        if (lastSrc != newSrc)
        {
            const targetVideo = lastVideoIndex == 1 ? videoElement : videoElement2;
            targetVideo.querySelector('source').setAttribute('src', newSrc);
            targetVideo.load();
            targetVideo.play();
            targetVideo.style.opacity = 1;
            lastVideo.style.opacity = 0;
            lastVideoIndex = 1 - lastVideoIndex;
        }
    };
    updateBgVideo();
    //const debouncedUpdateBgVideo = debounce(updateBgVideo, 100);
    window.addEventListener('scroll', updateBgVideo);
    window.addEventListener('resize', updateBgVideo);

    // Update BGM
    const updateBgm = () => {
        const triggerTop = document.getElementById('team-boundary').getBoundingClientRect().top;
        const triggerBottom = document.getElementById('contributors').getBoundingClientRect().top;
        const scroll = window.innerHeight * 0.8;
        if (triggerTop <= scroll && scroll <= triggerBottom && simpleBgmSelected) {
            simpleBgmSelected = false;
            crossfade(bgmSimple, bgm, bgmSimple.currentTime);
        } else if (!simpleBgmSelected && (scroll < triggerTop || triggerBottom < scroll)) {
            simpleBgmSelected = true;
            crossfade(bgm, bgmSimple, bgm.currentTime);
        }
    };
    const debouncedUpdateBgm = debounce(updateBgm, 100);
    window.addEventListener('scroll', debouncedUpdateBgm);
    window.addEventListener('resize', debouncedUpdateBgm);

    // slide-up
    const slideUpElements = document.querySelectorAll('.slide-up');
    const slideUpPersistElements = document.querySelectorAll('.slide-up-persist');
    const updateSlide = () => {
        const highH = window.innerHeight * 0.2;
        const lowH = window.innerHeight * 0.8;
        slideUpElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (highH < rect.bottom && rect.top < lowH) {
                element.classList.add('visible');
            } else if (rect.bottom < -100 || window.innerHeight < rect.top) {
                element.classList.remove('visible');
            }
        });
        slideUpPersistElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (100 < rect.bottom && rect.top < lowH) {
                element.classList.add('visible');
            } else if (rect.bottom < -100 || window.innerHeight < rect.top) {
                element.classList.remove('visible');
            }
        });
    };
    window.addEventListener('scroll', updateSlide);
    window.addEventListener('resize', updateSlide);

    // silhouette
    const silhouetteElements = document.querySelectorAll('.silhouette');
    const updateSilhouette = () => {
        const middleH = window.innerHeight * 0.5;
        silhouetteElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (middleH < rect.bottom && rect.top < middleH) {
                element.classList.remove('silhouette');
            } else {
                element.classList.add('silhouette');
            }
        });
    };
    window.addEventListener('scroll', updateSilhouette);
    window.addEventListener('resize', updateSilhouette);


    // hover
    const hoverWrappers = document.querySelectorAll('.hv-wrapper');
    hoverWrappers.forEach(wrapper => {
        const hoverImages = wrapper.querySelectorAll('.hv');
        const nonHoverImages = wrapper.querySelectorAll('.non-hv');
        const hoverSlideUpImages = wrapper.querySelectorAll('.hv-slide-up');
        let timeoutIds = [];
        wrapper.addEventListener('mouseover', () => {
            hoverImages.forEach(hoverImage => {
                hoverImage.style.opacity = 1;
            });
            nonHoverImages.forEach(image => {
                image.style.opacity = 0;
            })
            for (let i = 0; i < hoverSlideUpImages.length; i++) {
                const timeoutId = setTimeout(function() {
                    hoverSlideUpImages[i].classList.add('visible');
                }, i * 500);
                timeoutIds.push(timeoutId);
            }
        });
        wrapper.addEventListener('mouseout', () => {
            hoverImages.forEach(hoverImage => {
                hoverImage.style.opacity = 0;
            });
            nonHoverImages.forEach(image => {
                image.style.opacity = 1;
            })
            timeoutIds.forEach(id => clearTimeout(id));
            timeoutIds = [];
            for (let i = 0; i < hoverSlideUpImages.length; i++) {
                hoverSlideUpImages[i].classList.remove('visible');
            }
        });
    });
    const duoHoverWrappers = document.querySelectorAll('.duo-hv-wrapper')
    duoHoverWrappers.forEach(wrapper => {
        wrapper.addEventListener('mousemove', function (e) {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width / 2) {
                wrapper.querySelector('.bg-l').style.opacity = '1';
                wrapper.querySelector('.bg-r').style.opacity = '0';
                wrapper.querySelector('.ch-r').style.opacity = '0.2';
                wrapper.querySelector('.ch-r').classList.add('silhouette');
                wrapper.querySelector('.ch-l').style.opacity = '1';
                wrapper.querySelector('.ch-l').classList.remove('silhouette');
            }
            else {
                wrapper.querySelector('.bg-r').style.opacity = '1';
                wrapper.querySelector('.bg-l').style.opacity = '0';
                wrapper.querySelector('.ch-l').style.opacity = '0.2';
                wrapper.querySelector('.ch-l').classList.add('silhouette');
                wrapper.querySelector('.ch-r').style.opacity = '1';
                wrapper.querySelector('.ch-r').classList.remove('silhouette');
            }
        });
        wrapper.addEventListener('mouseleave', function () {
            wrapper.querySelector('.bg-l').style.opacity = '0';
            wrapper.querySelector('.bg-r').style.opacity = '0';
            wrapper.querySelector('.ch-l').style.opacity = '1';
            wrapper.querySelector('.ch-r').style.opacity = '1';
            updateSilhouette();
        });
    });

    updateBgVideo();
    $('#loading').fadeOut('slow');

    // appear
    const appearElement = document.querySelector('.appear');
    if (appearElement) {
        appearElement.style.opacity = 1;
    }
});

// Functions

function scrollToTop() {
    document.body.scrollTop = 0;  // For Safari
    document.documentElement.scrollTop = 0;  // For Chrome, Firefox, IE and Opera
}

function scrollToSection(section) {
    const element = document.getElementById(section);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const absouteElementTop = rect.top + window.scrollY;
    const middleOfViewport = window.innerHeight * 0.5;
    window.scrollTo({ top: absouteElementTop - middleOfViewport, behavior: 'instant' });
}

let fadeOutInterval = null;
function crossfade(audioOut, audioIn, currentTime) {
    if (fadeOutInterval) {
        clearInterval(fadeOutInterval);
    }
    audioIn.currentTime = currentTime;
    audioIn.play();
    fadeOutInterval = setInterval(() => {
        if (audioOut.volume > 0 || audioIn.volume < 1) {
            audioOut.volume = Math.max(audioOut.volume - 0.02, 0);
            audioIn.volume = Math.min(audioIn.volume + 0.02, 1);
        } else {
            clearInterval(fadeOutInterval);
        }
    }, 50);
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, arguments);
        }, wait);
    };
}

// Random text

let teamBoundaryLines = [
    '<blockquote><big>보</big>수는 비싸게 받을 거니까 기억해 둬.</blockquote> ― 레이무',
    '<blockquote><big>보</big>수는 확실히 지불할게. 난 네가 아니니까.</blockquote> ― 유카리',
    '<blockquote><big>나</big>는 그렇다 쳐도, 이 녀석의 역사는 간식거리밖엔 안 될 걸.</blockquote> ― 유카리',
    '<blockquote><big>정</big>말이지, 넌 행운이 넘치네. 우리 란한테도 나눠주고 싶을 정도야.</blockquote> ― 유카리',
    '<blockquote><big>잘</big>은 모르겠는데, 이 녀석을 쓰러뜨리면 만사 오케이?</blockquote> ― 레이무',
    '<blockquote><big>기</big>다리면서 같이 놀 상대를 찾고 있었어?</blockquote> ― 유카리',
]
document.querySelectorAll('.team-boundary-random-line').forEach(line => {
    const index = Math.floor(Math.random() * teamBoundaryLines.length);
    const text = teamBoundaryLines.splice(index, 1)[0];
    line.innerHTML = text;
});
let teamMagicLines = [
    '<blockquote><big>태</big>평해서 좋겠네. 달구경이나 하고.</blockquote> ― 앨리스',
    '<blockquote><big>어</big>머, 나도 즐기고 있는데? 마리사, 너 이상으로 말이야.</blockquote> ― 앨리스',
    '<blockquote><big>마</big>리사가 요괴퇴치라니 웃기는 소리네.</blockquote> ― 앨리스',
    '<blockquote><big>그</big>쪽엔 인간밖에 없다구. 그것도 나처럼 선량한 인간 말야.</blockquote> ― 마리사',
    '<blockquote><big>뭔</big> 소리야? 마법은 한밤중에 내키는대로 써야 제맛이라고.</blockquote> ― 마리사',
    '<blockquote><big>멋</big>진 부분만 뺏어가지 말라고.</blockquote> ― 앨리스',
    '<blockquote><big>탄</big>막이 두뇌? 너 바보 아니냐? 탄막은 파워라고.</blockquote> ― 마리사',
    '<blockquote><big>탄</big>막은 브레인. 상식이잖아.</blockquote> ― 앨리스',
    '<blockquote><big>마</big>리사! 이 녀석을 쏴버려.</blockquote> ― 앨리스',
    '<blockquote><big>정</big>신이 나간 녀석들은 보통 달이 원인이지. 딱히 깊은 뜻은 없어.</blockquote> ― 마리사',
]
document.querySelectorAll('.team-magic-random-line').forEach(line => {
    const index = Math.floor(Math.random() * teamMagicLines.length);
    const text = teamMagicLines.splice(index, 1)[0];
    line.innerHTML = text;
});
let teamScarletLines = [
    '<blockquote><big>괜</big>찮아, 난 인간 이외엔 흥미가 없으니까.</blockquote> ― 레밀리아',
    '<blockquote><big>하</big>아, 무자비한 것도 정도가 있으셔야지.</blockquote> ― 사쿠야',
    '<blockquote><big>아</big>가씨, 이 정도 녀석들을 일일이 상대하자면 끝이 없습니다.</blockquote> ― 사쿠야',
    '<blockquote><big>튀</big>기는 건 나중에 하고 일단 가죠. 밤은 짧답니다.</blockquote> ― 사쿠야',
    '<blockquote><big>저</big>희 저택에 더 이상 지식인은 필요 없답니다…….</blockquote> ― 사쿠야',
    '<blockquote><big>아</big>가씨. 잠깐만 시간을 빌려도 괜찮을까요?</blockquote> ― 사쿠야',
    '<blockquote><big>우</big>리 지식인은 책만 읽어대서 별로 도움이 안 되는 거 같은데……</blockquote> ― 레밀리아',
    '<blockquote><big>피</big>는 특별히 빨지 않을 테니까, 얼른 돌아가도록.</blockquote> ― 레밀리아',
    '<blockquote><big>사</big>쿠야, 저 녀석이 나쁜 놈이야. 한눈에 알아챘어. 저 악당 같은 모습 봐봐.</blockquote> ― 레밀리아',
    '<blockquote><big>올</big>바른 길로 나아가서 힘으로 압도한다. 이게 불평이 나오지 않게 하는 비결이랍니다.</blockquote> ― 사쿠야',
]
document.querySelectorAll('.team-scarlet-random-line').forEach(line => {
    const index = Math.floor(Math.random() * teamScarletLines.length);
    const text = teamScarletLines.splice(index, 1)[0];
    line.innerHTML = text;
});
let teamGhostLines = [
    '<blockquote><big>요</big>우무, 두고 가지 말라니까~</blockquote> ― 유유코',
    '<blockquote><big>무</big>슨 말씀을 하시는 겁니까. 밤은 짧다고요! 빨리 적을 찾아 베어 뭉개야 합니다.</blockquote> ― 요우무',
    '<blockquote><big>어</big>머. 급할수록 돌아가라는 말 알고 있니?</blockquote> ― 유유코',
    '<blockquote><big>그</big>래서, 다음엔 어디로 가면 좋을까요?</blockquote> ― 요우무',
    '<blockquote><big>참</big>새는 잔뼈가 많아서 싫어.</blockquote> ― 유유코',
    '<blockquote><big>너</big>무하네. 망령을 이상한 사람 취급하다니.</blockquote> ― 유유코',
    '<blockquote><big>네</big>? 아, 알겠어요, 벤다니까요.</blockquote> ― 요우무',
    '<blockquote><big>그</big>럼 일단은 내 방패가 되려무나.</blockquote> ― 유유코',
]
document.querySelectorAll('.team-ghost-random-line').forEach(line => {
    const index = Math.floor(Math.random() * teamGhostLines.length);
    const text = teamGhostLines.splice(index, 1)[0];
    line.innerHTML = text;
});
let wriggleLines = [
    '<big>반</big>딧불이라니까!',
    '<big>달</big>이 보이는 밤은 즐겨야 하지 않겠어?',
    '<big>안</big> 덤비면 이쪽에서 먼저 간다!',
    '<big>호</big>랑이도 제말하면 나타나는 법!',
    '<big>반</big>딧불을 보고 기뻐하지 않는 녀석들이라니, 정말 간만에 본다!',
    '<big>그</big>거 혹시 무서운 이야기야?',
]
let mystiaLines = [
    '<big>같</big>이 마을에 내려가서 인간들을 놀래켜보지 않을래?',
    '<big>내</big>가 야맹증으로 만들어줄게!',
    '<big>이</big>런 밤중에 어딜 가려고?',
    '<big>밤</big>길에서 날 두려워하지 않는 인간은 없어.',
    '<big>당</big>신들에겐 내 노랫소리가 안 닿는 거야?',
    '<big>밤</big>은 인간 사냥 서비스 타임이야.',
]
let keineLines = [
    '<big>오</big>늘 밤을 없던 걸로 만들어주마!',
    '<big>이</big> 불길한 밤으로부터 사람들을 지키겠어.',
    '<big>보</big>름달이 없으면 인간이야.',
    '<big>얼</big>굴만 남기고 변신할 필요는 없잖아? 변신이란 건 온몸으로 하는 거야.',
    '<big>오</big>늘 밤은 네놈들의 역사로 <ruby>만한전석<rt>滿漢全席</rt></ruby>이다!',
    '<big>요</big>괴가 하는 말은 못 믿겠는데.',
    '<big>진</big>짜 어두운 밤의 공포를 가르쳐주지!',
]
let reimuLines = [
    '<big>대</big>체 무슨 꿍꿍이신 걸까, 응?',
    '<big>오</big>늘 너희들 손 좀 봐줘야지 안되겠네 이거.',
    '<big>달</big>빛이 모인 이 죽림에서 너흰 한 그루 빛나는 대나무가 될 거야. 정말 이쁘겠다, 그치?',
    '<big>끝</big>나지 않는 밤은 여기서 끝이야!',
    '<big>나</big>쁜 짓도 적당히들 해 둬.',
    '<big>내</big>일이 됐는데도 계속 밤이라면 정말 싫겠다~',
]
let marisaLines = [
    '<big>움</big>직이면 쏜다! 아, 이게 아니지. 쏘면 움직일 거다.',
    '<big>난</big> 평소대로 민폐스런 요괴를 퇴치하러 다니고 있을 뿐이거든.',
    '<big>이</big>제 슬슬 내일 아침을 받아내야겠어.',
    '<big>알</big>아듣게 말하라고. 여긴 환상향이야.',
    '<big>자</big>멸하기 전에 퇴치해버려야겠지.',
    '<big>잠</big> 깨면 아침이나 되어있길 빌어야지.',
]
let tewiLines = [
    '<big>마</big>리사는 숲 밖에 집을 장만하면 행복해질 거야~',
    '<big>사</big>쿠야는 지금 거처를 버리고 독립하면 행복해질 거야~',
    '<big>요</big>우무는 그 검으로 자신을 찔러보면 더 행복해질 거야~',
    '<big>나</big>한테 생각이 있으니까 새 장사를 시작하는 게 좋을 거야.',
    '<big>이</big> 주변엔 귀여운 토끼가 많네.',
    '<big>나</big>한테 좋은 생각이 있는데……',
    '<big>다</big>들 내가 말하는 걸 들으면 좀 더 행복해질 수 있어요~',
    '<big>좀</big> 더 행복해지고 싶으면, 커다란 마음을 가져야 해.',
]
let udongeinLines = [
    '<big>맡</big>겨 주세요. 문은 하나도 빠짐없이 닫아 두었습니다.',
    '<big>당</big>신들에게 보여줄게. 달의 광기의 모든 것을!',
    '<big>달</big>은 사람을 미치게 만든다고.',
    '<big>달</big>토끼인 내 눈을 보고도, 미치지 않은 채로 있을 수 있을까?',
    '<big>아</big>, 큰일이다! 아직 닫히지 않은 문이 남아있었나.',
    '<big>아</big>아, 사부님께 야단맞겠다…….',
    '<big>정</big>말이지, 이상한 녀석들이 다 들어왔네.',
    '<big>이</big>쪽은 바쁘단 말야. 좀도둑질 말고 볼일 없으면 어서들 돌아가.',
]
let eirinLines = [
    '<big>곧</big> 아침이 될 거야. 그럼 보름달은 돌려주겠어.',
    '<big>아</big>침이 올 때까지라면 놀아주지.',
    '<big>자</big>, 환상향의 여명은 바로 눈앞에 있어!',
    '<big>인</big>간과 요괴라…… 오늘은 희한한 손님들이 찾아왔는걸.',
    '<big>능</big>력에도 특허를 인정해야 하는 걸까?',
    '<big>아</big>침이 되면 보름달은 돌려줄게.',
    '<big>말</big>보다는 탄막 처방이 필요할 것 같네!',
]
let kaguyaLines = [
    '<big>가</big>끔 찾아오는 손님들은 정중히 대접해줘야지.',
    '<big>모</big>처럼 폼 잡는데 찬물 끼얹지 말라구~',
    '<big>여</big>태까지 몸을 숨기고 있느라 그다지 밖으로 못 나가봤을 뿐이야.',
    '<big>유</big>감스럽게도 진정한 보름달은 여기서밖에 보이지 않아.',
    '<big>지</big>금까지 수많은 사람을 무릎 꿇린 다섯 가지 문제. 당신들은 몇 개나 풀어낼 수 있을까?',
    '<big>새</big>벽은 이제 곧 찾아올 거야.',
    '<big>이</big>상한 이름 붙이지 마!',
    '<big>너</big>무 지루해서 죽을 맛이라니까.',
]
let mokouLines = [
    '<big>목</big>적은 뭐지? 바보 씨.',
    '<big>어</big>이쿠, 담력 시험이라니!',
    '<big>언</big>제부터 인간들은 이렇게 바보가 된 거람?',
    '<big>카</big>구야 저건 언제나, 항상, 날 없애려고만 하고!',
    '<big>난</big> 죽지 않아. 절대로 죽는 일이 없어. 저 밉살스런 카구야 때문에.',
    '<big>죽</big>진 않지만 아프다니까~',
    '<big>죽</big>진 않겠지만 무서워~',
    '<big>어</big>라, 너무하네. 난 인간도 아니라는 거야?',
    '<big>딱</big>히 잡아먹지는 않을테니 안심해.',
    '<big>한</big> 번 손을 대면 어른이 될 수 없고, 두 번 손을 대면 병고를 잊게 되리. 세 번 손을 대면……',
    '<big>불</big>로불사 같은 건 되지 않는 편이 나아.',
    '<big>둘</big> 다 나보다 나이 적잖아?',
]
document.querySelectorAll('.Wriggle-random-line').forEach(line => {
    const index = Math.floor(Math.random() * wriggleLines.length);
    const text = wriggleLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Mystia-random-line').forEach(line => {
    const index = Math.floor(Math.random() * mystiaLines.length);
    const text = mystiaLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Keine-random-line').forEach(line => {
    const index = Math.floor(Math.random() * keineLines.length);
    const text = keineLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Reimu-random-line').forEach(line => {
    const index = Math.floor(Math.random() * reimuLines.length);
    const text = reimuLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Marisa-random-line').forEach(line => {
    const index = Math.floor(Math.random() * marisaLines.length);
    const text = marisaLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Tewi-random-line').forEach(line => {
    const index = Math.floor(Math.random() * tewiLines.length);
    const text = tewiLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Udongein-random-line').forEach(line => {
    const index = Math.floor(Math.random() * udongeinLines.length);
    const text = udongeinLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Eirin-random-line').forEach(line => {
    const index = Math.floor(Math.random() * eirinLines.length);
    const text = eirinLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Kaguya-random-line').forEach(line => {
    const index = Math.floor(Math.random() * kaguyaLines.length);
    const text = kaguyaLines.splice(index, 1)[0];
    line.innerHTML = text;
});
document.querySelectorAll('.Mokou-random-line').forEach(line => {
    const index = Math.floor(Math.random() * mokouLines.length);
    const text = mokouLines.splice(index, 1)[0];
    line.innerHTML = text;
});

// Random character

const characters = [
    '하쿠레이 레이무',
    '야쿠모 유카리',
    '키리사메 마리사',
    '앨리스 마가트로이드',
    '이자요이 사쿠야',
    '레밀리아 스칼렛',
    '콘파쿠 요우무',
    '사이교우지 유유코',
    '리글 나이트버그',
    '미스티아 로렐라이',
    '카미시라사와 케이네',
    '이나바 테위',
    '레이센 우동게인 이나바',
    '야고코로 에이린',
    '호라이산 카구야',
    '후지와라노 모코우'
]

const setDailyCharacter = () => {
    const dailyCharacterElement = document.getElementById('daily-character');
    if (!dailyCharacterElement) return;
    const today = now.toISOString().split('T')[0];
    const seed = today;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % characters.length;
    dailyCharacterElement.innerHTML = characters[index];
}
window.addEventListener('load', setDailyCharacter);

// D-day

const setDDay = () => {
    const dDayElement = document.getElementById('d-day');
    if (!dDayElement) return;
    const timeDiff = new Date('2004-08-15') - now;
    const dayDiff = Math.floor(-timeDiff / (1000 * 60 * 60 * 24));
    dDayElement.textContent = `D+${Math.abs(dayDiff)}`;
};
window.addEventListener('load', setDDay);
const setDDay20th = () => {
    const dDay20Element = document.getElementById('d-day-20');
    const timeDiff = new Date('2024-08-15') - now;
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (dayDiff > 0) {
        dDay20Element.innerHTML = `D-${dayDiff}`;
    } else if (dayDiff == 0) {
        dDay20Element.innerHTML = `<b>D-DAY</b>`;
    } else {
        const daySince = Math.floor(-timeDiff / (1000 * 60 * 60 * 24));
        dDay20Element.innerHTML = `D+${daySince}`;
    }
};
window.addEventListener('load', setDDay20th);
