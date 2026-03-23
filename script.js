document.addEventListener("DOMContentLoaded", () => {
    const picsContainer = document.getElementById("floating-pics-container");
    const treePicsDir = document.getElementById("tree-pics");
    
    // Using us1.jpeg to us15.jpeg for the floating background
    const picFiles = [
        "us1.jpeg", "us2.jpeg", "us3.jpeg", "us4.jpeg", "us5.jpeg", 
        "us6.jpeg", "us7.jpeg", "us8.jpeg", "us9.jpeg", "us10.jpeg", 
        "us11.jpeg", "us12.jpeg", "us13.jpeg", "us14.jpeg", "us15.jpeg"
    ]; 
    const placedPositions = [];

    // All 15 pictures will be floating backgrounds/midgrounds
    const floatingCount = picFiles.length;

    for (let i = 0; i < floatingCount; i++) {
        const polaroid = document.createElement("div");
        polaroid.classList.add("polaroid");
        
        // Depth logic: 4 levels for a highly profound 3D parallax sizing
        // 0 = Far Background, 1 = Background, 2 = Midground, 3 = Near Midground
        const depthLevel = Math.floor(Math.random() * 4);
        
        // Adjust properties based on depth
        let scaleSize = 1;
        let zIndex = 1;
        let animationDurationBase = 20;

        if (depthLevel === 0) {
            // Far Background: increased size and clarity so it's not too far back
            scaleSize = 0.55;
            zIndex = 0;
            animationDurationBase = 35; // Very slow
            polaroid.style.opacity = "0.2";
            polaroid.style.filter = "blur(1.5px) brightness(0.7)";
        } else if (depthLevel === 1) {
            // Background
            scaleSize = 0.75;
            zIndex = 5;
            animationDurationBase = 25; 
            polaroid.style.opacity = "0.35";
            polaroid.style.filter = "blur(0.5px) brightness(0.85)";
        } else if (depthLevel === 2) {
            // Midground
            scaleSize = 0.95;
            zIndex = 10;
            animationDurationBase = 18;
            polaroid.style.opacity = "0.55";
            polaroid.style.filter = "none";
        } else {
            // Near Midground
            scaleSize = 1.15;
            zIndex = 15; // Still below the tree prop
            animationDurationBase = 12; // Fastest of the floating
            polaroid.style.opacity = "0.8";
            polaroid.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)";
            polaroid.style.filter = "none";
        }

        polaroid.style.zIndex = zIndex;
        polaroid.style.setProperty('--depth-scale', scaleSize);
        
        const img = document.createElement("img");
        img.src = picFiles[i]; 
        
        img.onerror = () => {
            img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-family="sans-serif" font-size="20">Pic</text></svg>';
        };
        
        polaroid.appendChild(img);
        picsContainer.appendChild(polaroid);

        // Grid-based random placement with light collision avoidance
        let randomLeft, randomTop;
        let isOverlapping = true;
        let attempts = 0;
        const minimumDistance = 15; 

        while (isOverlapping && attempts < 50) {
            randomLeft = Math.random() * 85; 
            randomTop = Math.random() * 85;  
            isOverlapping = false;

            // Strict keep-out zone to avoid the bottom-left Tree completely!
            // Adjust keep-out dynamically for mobile screens
            const isMobile = window.innerWidth <= 768;
            const keepOutLeft = isMobile ? 65 : 45; // Take up more relative vw on mobile
            const keepOutTop = isMobile ? 65 : 50;  // Takes up less relative vh on mobile

            // Extended slightly to account for the image's own width and floating movement
            if (randomLeft < keepOutLeft && randomTop > keepOutTop) {
                isOverlapping = true;
                attempts++;
                continue;
            }
            
            for (let pos of placedPositions) {
                if (pos.depth === depthLevel) {
                    const diffX = Math.abs(randomLeft - pos.left);
                    const diffY = Math.abs(randomTop - pos.top);
                    if (diffX < minimumDistance && diffY < minimumDistance) {
                        isOverlapping = true;
                        break;
                    }
                }
            }
            attempts++;
        }
        
        placedPositions.push({ left: randomLeft, top: randomTop, depth: depthLevel });

        polaroid.style.left = randomLeft + "vw";
        polaroid.style.top = randomTop + "vh";
        
        // Random rotations
        const rotStart = (Math.random() * 60 - 30) + "deg";
        const rotEnd = (Math.random() * 60 - 30) + "deg";
        polaroid.style.setProperty('--rot-start', rotStart);
        polaroid.style.setProperty('--rot-end', rotEnd);
        
        // Speed scaling based on depth
        polaroid.style.animationDuration = (Math.random() * 5 + animationDurationBase) + "s";
        polaroid.style.animationDelay = "-" + (Math.random() * 10) + "s";
    }

    // Floating Pictures Shuffling Effect
    // Periodically pick TWO random floating polaroids and swap their pictures!
    // This perfectly prevents duplicate pictures from ever being on screen.
    setInterval(() => {
        const floatingImages = document.querySelectorAll("#floating-pics-container .polaroid img");
        if (floatingImages.length >= 2) {
            // Pick two different random images currently floating
            let idx1 = Math.floor(Math.random() * floatingImages.length);
            let idx2 = Math.floor(Math.random() * floatingImages.length);
            
            // Make sure we didn't pick the exact same polaroid twice
            while (idx1 === idx2) {
                idx2 = Math.floor(Math.random() * floatingImages.length);
            }
            
            const img1 = floatingImages[idx1];
            const img2 = floatingImages[idx2];
            
            // Fade out both images
            img1.style.opacity = 0;
            img2.style.opacity = 0;
            
            setTimeout(() => {
                // Swap their image sources safely behind the scenes
                const tempSrc = img1.src;
                img1.src = img2.src;
                img2.src = tempSrc;
                
                // Fade both back in!
                img1.style.opacity = 1;
                img2.style.opacity = 1;
            }, 600); // Wait for the 0.6s CSS transition to finish before swapping
        }
    }, 3000); // Swap a pair every 3 seconds

    // ---- Foreground Static Pictures ----
    // Use us16.jpeg and us17.jpeg for the static foreground tree prop
    const treePics = ["us16.jpeg", "us17.jpeg"];

    treePics.forEach((src, index) => {
        const polaroid = document.createElement("div");
        polaroid.classList.add("static-polaroid");
        
        const img = document.createElement("img");
        img.src = src;
        img.onerror = () => {
            img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-family="sans-serif" font-size="20">Static</text></svg>';
        };
        polaroid.appendChild(img);

        // Position them precisely using CSS classes!
        polaroid.classList.add("tree-pic-" + (index + 1));

        treePicsDir.appendChild(polaroid);
    });

    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");
    const page3 = document.getElementById("page3");

    // ---- Page 1: Salt & Lemon ----
    const shaker = document.getElementById("salt-shaker");
    const lemon = document.getElementById("lemon");
    const progressBar = document.getElementById("salt-progress");
    const interactionArea = document.querySelector(".interaction-area");

    let isDragging = false;
    let saltAmount = 0;
    const maxSalt = 100;

const startDrag = () => { isDragging = true; };
    const stopDrag = () => { 
        isDragging = false; 
        shaker.style.transform = 'translate(-50%, 0) rotate(0deg)'; 
    };

    shaker.addEventListener("mousedown", startDrag);
    shaker.addEventListener("touchstart", (e) => {
        startDrag();
    }, { passive: true });

    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return;

        const rect = interactionArea.getBoundingClientRect();

        // Roughly follow relative to the interaction container
        shaker.style.left = (clientX - rect.left) + 'px';
        shaker.style.top = (clientY - rect.top - 20) + 'px'; 
        shaker.style.transform = 'translate(-50%, -50%) rotate(-30deg)';

        // Drop salt if moving
        if (Math.random() > 0.5) {
            dropSalt(clientX, clientY);
        }

        // Check if cursor is over the lemon
        const lemonRect = lemon.getBoundingClientRect();
        if (
            clientX >= lemonRect.left && clientX <= lemonRect.right &&
            clientY >= lemonRect.top && clientY <= lemonRect.bottom
        ) {
            saltAmount += 1.5;
            progressBar.style.width = Math.min((saltAmount / maxSalt) * 100, 100) + '%';

            if (saltAmount >= maxSalt) {
                isDragging = false;
                saltAmount = 0; // Prevent multi-trigger
                setTimeout(() => goToPage(page2), 200); 
            }
        }
    };

    document.addEventListener("mousemove", (e) => handleMove(e.clientX, e.clientY));
    document.addEventListener("touchmove", (e) => {
        if (isDragging) {
            e.preventDefault(); // crucial to prevent page scrolling while shaking
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        }
    }, { passive: false });

    function dropSalt(x, y) {
        const grain = document.createElement('div');
        grain.classList.add('salt-grain');
        grain.style.position = 'fixed';
        grain.style.left = (x + (Math.random() * 20 - 10)) + 'px';
        grain.style.top = y + 'px';
        document.body.appendChild(grain);
        
        setTimeout(() => {
            grain.remove();
        }, 500);
    }

    // ---- Page 2: Rasmalai ----
    const rasmalaiContainer = document.getElementById("rasmalai-container");
    const rasmalaiImg = document.getElementById("rasmalai-img");
    const memeOverlay = document.getElementById("meme-overlay");
    const memeAudio = document.getElementById("meme-audio");
    const chompAudio = document.getElementById("chomp-audio");
    const explosionOverlay = document.getElementById("explosion-overlay");

    let rasmalaiClicks = 0;

    rasmalaiImg.addEventListener("click", (e) => {
        rasmalaiClicks++;

        // Play chomp sound
        if (chompAudio) {
            chompAudio.currentTime = 0;
            chompAudio.play().catch(err => console.log("Audio ignored by browser."));
        }

        for (let i = 0; i < 8; i++) {
            const crumb = document.createElement("div");
            crumb.classList.add("crumb");
            crumb.style.left = e.clientX + "px";
            crumb.style.top = e.clientY + "px";
            
            // Send crumbs flying in random directions
            const tx = (Math.random() * 120 - 60) + "px";
            const ty = (Math.random() * 120 - 60) + "px";
            crumb.style.setProperty('--tx', tx);
            crumb.style.setProperty('--ty', ty);
            
            document.body.appendChild(crumb);
            setTimeout(() => crumb.remove(), 400); 
        }

        // Shrink the rasmalai and add a "bite wobble" animation
        const scaleVal = 1 - (rasmalaiClicks * 0.12);
        rasmalaiImg.style.setProperty('--s', scaleVal);
        
        // Reset animation so it can play again on fast clicks
        rasmalaiImg.style.animation = 'none';
        void rasmalaiImg.offsetWidth; 
        rasmalaiImg.style.animation = 'chompShake 0.2s ease-out';
        rasmalaiImg.style.transform = `scale(${scaleVal})`;

        if (rasmalaiClicks === 6) {
            memeOverlay.classList.remove("hidden");
            if(memeAudio) memeAudio.play().catch(e=>console.log("Audio play blocked by browser."));
            
            setTimeout(() => {
                memeOverlay.classList.add("hidden");
            }, 3000);
        }

        if (rasmalaiClicks === 7) {
            explosionOverlay.classList.remove("hidden");
            
            setTimeout(() => {
                goToPage(page3);
                generateWordCloud();
            }, 450);

            setTimeout(() => {
                explosionOverlay.classList.add("hidden");
            }, 1500);
        }
    });

    // ---- Page 3: Word Cloud ----
    const cloudContainer = document.getElementById("word-cloud");
    const modal = document.getElementById("reason-modal");
    const modalWord = document.getElementById("modal-word");
    const modalText = document.getElementById("modal-text");
    const closeBtn = document.querySelector(".close-btn");

    const reasons = [
        { word: "Eyes", text: "The weariness but wisdom behind them, I can't put it into words how much I fell for them. Whenever I look into them, I feel like nothing else matters other than us, it's an unexplainable feeling." },
        { word: "Laugh", text: "All I wanna do is make you laugh every single day. Your laugh makes me smile so much even if it's just a picture. The resistance to the laugh then the eventual burst of laughter is honestly the best part." },
        { word: "Growth", text: "Your desire to grow together and become the best version of ourselves is something I admire and love about you. Even if it's uncomfortable, you still do it just for us, and I love that about you." },
        { word: "Trust", text: "The trust you put in me which makes you feel safe is something I'll forever be grateful for." },
        { word: "Humor", text: "Never before have I been able to laugh as much and as easily as I do with you, your sense of humor aligns with mine and that's all I could ask for. It's autistic sure, but I'm autistic." },
        { word: "Straightforwardness", text: "You're extremely straightforward to people and you really couldn't give a shit about sugar coating the truth, which I value deeply in a person." },
        { word: "Hair", text: "'You said you like my hair, so go ahead and touch it' ahh. Your hair just frames your face so perfectly with that perfect wave and the way some strands fall on your face or just today when that one strand of hair was on top of your head." },
        { word: "Caring", text: "You care about me and others who you're close with to the point where I would trust you more than I would trust myself with a lot of things, and I love that about you." },
        { word: "Listener", text: "You listen to me when I'm talking about anything from how mcqueen should have life insurance to whether it would be justifiable from Trump's perspective to annex Iran. You're an amazing listener and I've never felt more heard, I love you." },
        { word: "Scent", text: "I dont know how to explain it but you smell like home. I could hold you for hours and never get tired of it." },
        { word: "Excitement", text: "The way you light up when something you're excited about gets mentioned, the way you become like a little child and go crazy talking about writing or cali burrito always brings a smile to my face, making me feel so happy that you're happy." },
        { word: "Conversations", text: "We can go from talking about ww3 to saying I love you 67 times in a row to you belting me for saying 67 and I'll never get tired of it." },
        { word: "Memory", text: "You remember, and that's all that matters. I remember when you said you wanted it to be a goodbye kiss and I have never felt so loved than in that moment, and for the record the kiss was magical I couldn't have asked for anything better." },
        { word: "Taste", text: "You have goated music taste, need I say more?" },
        { word: "Presence", text: "You're there when I need you to be, and that means everything to me. I aspire to be as good as you are." },
        { word: "Intelligence", text: "Don't say you're not smart. You are smart. You may not be math smart but you're english smart. You're psychology smart, you're people smart, and honestly that's the best smartness to have. Plus you have me to fill in the science smart part." },
        { word: "Thoughtfulness", text: "You think about the little things, you notice the little things, and I'm not just talking about my height, and holy shit I love you." },
        { word: "Beauty", text: "I fall for you every single time you send me a selfie or video, you're so beautiful that you made everyone else look mid compared to you. The way the corners of your eyes crinkle when you smile, the way you pout when you're bored, and your dimples god don't even get me started on those they make your smile even more smiley if that makes sense." },
        { word: "Cuddles", text: "Even though we haven't properly cuddled yet, the psuedo cuddling we've done so far is indescribable. I felt like I was on top of the world when you grabbed my arm and I can only look forward to when we actually cuddle." },
        { word: "Best friend", text: "You're not just my partner, you're my best friend. I want to celebrate me being able to afford your cali burrito order with you and mourn the loss of the food after we've ate it in less than 5 minutes." },
        { word: "Motivation", text: "You've made me a better person in the month we've been together. It may not seem like much, but because of you I've been able to open up and actually feel my emotions, and able to verbalize them. You've taught me to find the root cause, you've motivated me to have better self-esteem and even something as simple as liking my own smile." },
        { word: "Actions", text: "Your actions speak louder than words, you don't just tell me you love me, you show it. The gifts on our first date, THE FLOWERS HOLY THE FLOWERS I LOOK AT THEM EVERY SINGLE DAY. The photobooth pictures, our hugs, the way you reassure me when I overthink, everthing." },
        { word: "Enough", text: "You make me feel like I'm enough, and don't even let me think that I'm not. I'm not insecure around you and I smile so much around you with so much confidence you may as well be laughing gas." },
        { word: "Enough", text: "You make me feel like I'm enough, and don't even let me think that I'm not. I'm not insecure around you and I smile so much around you with so much confidence you may as well be laughing gas." },
        { word: "Paras", text: "The paras you write when I'm sleeping about how you feel about me and the way you update me about your day, I love that about you and it makes me feel connected to you in ways I can't describe." },
        { word: "Synchronicity", text: "Need I elaborate?" },
        { word: "Standing Up", text: "The way you stand up for yourself even if it's you against the world. It's inspiring and I aspire to be like you." },
        { word: "Goodnight", text: "You make it a point to say goodnight before you sleep and it reminds me that I'm the last thing running through your head at the end of the day." },
        { word: "Support", text: "You support me in everything I do, and it's so reassuring that I know I can count on you." },
        { word: "The World", text: "You're my world, my everything. If the entire world was against you, I would tell you to stop criticizing yourself. I love you so much and I hope we spend forever together. You make me so happy and grateful for you and you make me yearn in a way I haven't yearned before. Like wdym it's been only a month, it feels like I've spent years with you and even that feels too less. I wanna be with you making pasta while you sit on the kitchen counter yapping, I want to do taco bell mukbangs with you in our car, I wanna be the person you wake up to so we can cuddle. I love you phuhaar, I really do, and I don't think that's going to change anytime soon." },
    ];

    const colors = ['#fe5d9f', '#b5b5f1', '#0b6e4f', '#ffffff'];

    function generateWordCloud() {
        if(cloudContainer.children.length > 0) return; 

        const containerRect = cloudContainer.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        const placedBoundingRects = [];

        function isOverlapping(rect) {
            for (let i = 0; i < placedBoundingRects.length; i++) {
                const other = placedBoundingRects[i];
                if (!(rect.right < other.left || 
                      rect.left > other.right || 
                      rect.bottom < other.top || 
                      rect.top > other.bottom)) {
                    return true;
                }
            }
            return false;
        }

        // Distinguish the main central word from the rest
        let mainWordObj = null;
        let otherWords = [];
        
        reasons.forEach(item => {
            if (item.word.toLowerCase() === "the world") {
                mainWordObj = {
                    ...item,
                    size: 4.5, // Massive size
                    isVertical: false,
                    isCenter: true // flag to identify it
                };
            } else {
                otherWords.push({
                    ...item,
                    size: Math.random() * 1.8 + 1.0, // relative normal sizes
                    isVertical: Math.random() > 0.6
                });
            }
        });

        // Sort descending so largest words go near the center
        otherWords.sort((a, b) => b.size - a.size);

        // Put the main word at the very start of the array so it gets placed first!
        const wordsWithSize = [mainWordObj, ...otherWords];

        wordsWithSize.forEach((item) => {
            const span = document.createElement("span");
            span.textContent = item.word;
            span.classList.add("cloud-word");
            
            if (item.isCenter) {
                span.classList.add("center-world-word");
                span.style.fontSize = item.size + "rem"; 
            } else {
                span.style.fontSize = item.size + "rem";
                span.style.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            if (item.isVertical && !item.isCenter) {
                span.style.writingMode = "vertical-rl";
            }
            
            span.addEventListener("click", () => {
                modalWord.textContent = item.word;
                modalText.textContent = item.text;
                modal.classList.remove("hidden");
            });

            cloudContainer.appendChild(span);

            // Spiral algorithm to position the word exactly
            let angle = Math.random() * Math.PI * 2; 
            let radius = 0;
            const angleStep = 0.2;
            const radiusStep = 2;
            let placed = false;

            for (let i = 0; i < 3000; i++) {
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                span.style.left = x + "px";
                span.style.top = y + "px";

                const rect = span.getBoundingClientRect();
                
                const paddedRect = {
                    left: rect.left - 3,
                    right: rect.right + 3,
                    top: rect.top - 3,
                    bottom: rect.bottom + 3
                };

                const insideContainer = 
                    paddedRect.left >= containerRect.left &&
                    paddedRect.right <= containerRect.right &&
                    paddedRect.top >= containerRect.top &&
                    paddedRect.bottom <= containerRect.bottom;

                if (insideContainer && !isOverlapping(paddedRect)) {
                    placedBoundingRects.push(paddedRect);
                    placed = true;
                    break;
                }

                angle += angleStep;
                radius += radiusStep;
            }

            if (!placed) {
                span.style.display = 'none';
            }
        });
    }

    // Modal close handlers
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // Helper to switch pages
    function goToPage(targetPage) {
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.classList.add('hidden');
        });
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
});
