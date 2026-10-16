(() => {
  "use strict";

  const scene = document.getElementById("scene");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const storyScreen = document.getElementById("storyScreen");
  const startButton = document.getElementById("startButton");
  const restartStoryButton = document.getElementById("restartStoryButton");
  const letterOverlay = document.getElementById("letterOverlay");
  const letterClose = document.getElementById("letterClose");
  const dialogueColumn = document.querySelector(".dialogue-column");
  const dialoguePanel = document.getElementById("dialoguePanel");
  const dialogueText = document.getElementById("dialogueText");
  const choiceList = document.getElementById("choiceList");
  const nameEntry = document.getElementById("nameEntry");
  const continueButton = document.getElementById("continueButton");
  const backButton = document.getElementById("backButton");
  const eeveeToggle = document.getElementById("eeveeToggle");
  const eeveeGuide = document.getElementById("eeveeGuide");
  const guideHint = document.getElementById("guideHint");
  const sceneFriends = document.getElementById("sceneFriends");
  const sceneItems = document.getElementById("sceneItems");
  const footerNote = document.getElementById("footerNote");
  const playGameButton = document.getElementById("playGameButton");
  const gameOverlay = document.getElementById("gameOverlay");
  const gameClose = document.getElementById("gameClose");
  const gambleButton = document.getElementById("gambleButton");
  const gameIntro = document.getElementById("gameIntro");
  const summonPreview = document.getElementById("summonPreview");
  const summonPreviewImage = document.getElementById("summonPreviewImage");
  const summonPreviewName = document.getElementById("summonPreviewName");
  const karaokeOverlay = document.getElementById("karaokeOverlay");
  const karaokeTitle = document.getElementById("karaokeTitle");
  const karaokeSongName = document.getElementById("karaokeSongName");
  const karaokeAudio = document.getElementById("karaokeAudio");
  const karaokeAudioNote = document.getElementById("karaokeAudioNote");
  const karaokeLyrics = document.getElementById("karaokeLyrics");
  const karaokeSkip = document.getElementById("karaokeSkip");

  const state = {
    step: 0,
    place: "",
    friends: [],
    naming: false,
    names: {},
    dialogueClosed: false,
    friendCoordinates: {},
    drink: "",
    food: "",
    sceneItemCoordinates: {},
    invoked: "",
    gameChoice: "",
    conversationChoice: "",
    quizAnswers: {},
    beachActivity: "",
    beachSinging: "",
    beachMeetChoice: "",
    beachFriendsRevealed: false,
    beachCharacterCoordinates: {},
    beachSong: "",
    gameStage: 0,
    mansionPath: "", mansionFirstPath: "", mansionGamesPlayed: [], hideChoice: "", hideRounds: 0, chicaChoice: "", hideCaught: false, mansionGameComplete: false, boxChoice: "", mansionAfterPath: "", reunionChoice: ""
  };

  const places = [
    { value: "room", label: "A cozy room 🧸" },
    { value: "lake", label: "Scary Halloween Place 🎃" },
    { value: "beach", label: "A sunny beach 🌊" }
  ];
  const friendChoices = [
    { value: "dog", label: "A dog 🐶" },
    { value: "cat", label: "A cat 🐱" },
    { value: "bunny", label: "A bunny 🐰" },
    { value: "all", label: "All of them ♡" }
  ];
  const drinkChoices = [
    { value: "white-peach", label: "A white peach Red Bull 🥤" },
    { value: "tea", label: "A hot tea 🌼" },
    { value: "water", label: "Just some water 💧" }
  ];
  const foodChoices = [
    { value: "lasagna", label: "I'm hungry, get me lasagna!" },
    { value: "cake", label: "A piece of dark chocolate cake with raspberries" },
    { value: "strawberries", label: "I just want to eat some strawberries" }
  ];

  function placeSpeakingCharacter(key) {
    if (!key) return;
    const wrapper = sceneFriends.querySelector(`[data-beach-character="${key}"]`);
    if (!wrapper) return;
    // Keep the same sprite and its drag handlers; only adjust its position.
    // If it already occupies the speaker spot, move it to a nearby free spot first.
    const sceneRect = scene.getBoundingClientRect();
    const occupied = [...sceneFriends.querySelectorAll("[data-beach-character]")]
      .filter(el => el !== wrapper)
      .map(el => el.getBoundingClientRect());
    const candidates = [
      { left: 78, top: 25 }, { left: 80, top: 48 }, { left: 65, top: 30 },
      { left: 70, top: 55 }, { left: 55, top: 28 }, { left: 84, top: 65 }
    ];
    const overlaps = (x, y) => {
      const w = wrapper.offsetWidth, h = wrapper.offsetHeight;
      const rect = { left: sceneRect.left + sceneRect.width*x/100, top: sceneRect.top + sceneRect.height*y/100, right: sceneRect.left + sceneRect.width*x/100+w, bottom: sceneRect.top + sceneRect.height*y/100+h };
      return occupied.some(o => !(rect.right < o.left + 10 || rect.left > o.right - 10 || rect.bottom < o.top + 10 || rect.top > o.bottom - 10));
    };
    let target = candidates.find(pos => !overlaps(pos.left, pos.top));
    if (!target) target = candidates[0];
    wrapper.style.left = `${target.left}%`;
    wrapper.style.top = `${target.top}%`;
    wrapper.style.right = "auto";
    wrapper.style.bottom = "auto";
    wrapper.style.zIndex = "18";
    wrapper.classList.add("story-character--speaking");
  }

  function syncDialogueSpeaker(speaker, text) {
    sceneFriends.querySelectorAll(".story-character--speaking").forEach(el => el.classList.remove("story-character--speaking"));
    let key = null;
    if (state.place === "beach") {
      if (state.step >= 63 && state.step <= 74) key = "pompompurin";
      else if (state.step >= 81 && state.step <= 94) key = "pochacco";
      else if (state.step >= 105 && state.step <= 118) key = "keroppi";
      else if (state.step >= 120 && state.step <= 137) key = "pikachu";
    } else if (state.place === "lake") {
      if ([8, 9, 11, 13, 14].includes(state.step)) key = state.step === 9 ? "klee" : "futaba";
      else if (state.step === 15 || state.step === 16 || state.step === 21 || state.step === 22 || state.step === 23 || state.step === 24 || state.step === 25) key = state.mansionPath === "hutao" ? "hu-tao" : "hanako";
      else if ([17,18,19,20,26,28,44].includes(state.step)) key = "hu-tao";
      else if (state.step === 27) key = "darthvader";
      else if (state.step === 45) key = "hanako";
      else if (state.step === 48) key = "futaba";
      else if (state.step === 49) key = "klee";
    } else if (state.place === "room") {
      // In the bedroom, Eevee remains the narrator; any guest explicitly named
      // in the dialogue is brought forward when that character is present.
      const lower = String(text).toLowerCase();
      if (lower.startsWith("twilight") || speaker === "twilight") key = "twilight";
      else if (lower.startsWith("pompompurin") || lower.startsWith("pompom")) key = "pompompurin";
      else if (lower.startsWith("pochacco")) key = "pochacco";
      else if (lower.startsWith("keroppi")) key = "keroppi";
    }
    if (speaker === "summoned" && state.place === "beach" && state.step >= 120) key = "pikachu";
    placeSpeakingCharacter(key);
  }

  function setDialogue(text, speaker = "eevee") {
    dialoguePanel.classList.toggle("speaker--twilight", speaker === "twilight" || speaker === "summoned" || speaker === "pikachu");
    dialoguePanel.setAttribute("aria-label",
      speaker === "twilight" ? "Twilight Sparkle's message" :
      speaker === "summoned" ? "The summoned character's message" : "Eevee's message");
    dialogueText.textContent = text;
    dialogueText.classList.remove("text-enter");
    void dialogueText.offsetWidth;
    dialogueText.classList.add("text-enter");
    syncDialogueSpeaker(speaker, text);
  }

  function clearChoices() {
    choiceList.replaceChildren();
    choiceList.classList.remove("mansion-choice-grid", "mansion-hiding-grid", "mansion-box-grid");
    nameEntry.replaceChildren();
  }

  function showChoices(options, selected, onSelect) {
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = option.label;
      button.setAttribute("aria-pressed", String(selected === option.value));
      button.addEventListener("click", () => {
        onSelect(option.value);
        [...choiceList.querySelectorAll(".choice-button")].forEach(choice => {
          choice.setAttribute("aria-pressed", String(choice === button));
        });
      });
      choiceList.appendChild(button);
    });
  }

  function showMansionHidingGrid() {
    choiceList.replaceChildren();
    choiceList.classList.add("mansion-choice-grid", "mansion-hiding-grid");
    for (let n = 1; n <= 9; n++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mansion-grid-button";
      button.textContent = String(n);
      button.setAttribute("aria-label", `Hiding place ${n}`);
      button.setAttribute("aria-pressed", String(state.hideChoice === String(n)));
      button.addEventListener("click", () => {
        state.hideChoice = String(n);
        choiceList.querySelectorAll(".mansion-grid-button").forEach(el => el.setAttribute("aria-pressed", String(el === button)));
        continueButton.disabled = false;
      });
      choiceList.appendChild(button);
    }
  }

  function showMansionBoxGrid() {
    choiceList.replaceChildren();
    choiceList.classList.add("mansion-choice-grid", "mansion-box-grid");
    const options = [
      { value: "box1", label: "Box 1" },
      { value: "box2", label: "Box 2" },
      { value: "box3", label: "Box 3" }
    ];
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mansion-box-button";
      button.setAttribute("aria-pressed", String(state.boxChoice === option.value));
      const img = document.createElement("img"); img.src = "assets/box.png"; img.alt = "";
      const label = document.createElement("span"); label.textContent = option.label;
      button.append(img, label);
      button.addEventListener("click", () => {
        state.boxChoice = option.value;
        choiceList.querySelectorAll(".mansion-box-button").forEach(el => el.setAttribute("aria-pressed", String(el === button)));
        continueButton.disabled = false;
      });
      choiceList.appendChild(button);
    });
  }

  function updateBackground(place) {
    scene.classList.remove("scene--room", "scene--lake", "scene--beach", "scene--final", "scene--mansion");
    if (place) scene.classList.add(`scene--${place}`);
  }

  function chosenAnimals() {
    if (state.friends.includes("all")) return ["dog", "cat", "bunny"];
    return state.friends;
  }

  // Coordinates are deliberately kept on the land/room floor, not in the lake or sea.
  const friendPositions = {
    room: {
      dog:   { left: "12%", bottom: "7%", width: "clamp(86px, 12vw, 155px)" },
      cat:   { left: "70%", bottom: "7%", width: "clamp(80px, 11vw, 140px)" },
      bunny: { left: "42%", bottom: "5%", width: "clamp(62px, 8vw, 105px)" }
    },
    lake: {
      dog:   { left: "7%", bottom: "19%", width: "clamp(86px, 12vw, 155px)" },
      cat:   { right: "5%", bottom: "29%", width: "clamp(80px, 11vw, 140px)" },
      bunny: { right: "24%", bottom: "8%", width: "clamp(62px, 8vw, 105px)" }
    },
    beach: {
      dog:   { left: "9%", bottom: "7%", width: "clamp(86px, 12vw, 155px)" },
      cat:   { right: "9%", bottom: "7%", width: "clamp(80px, 11vw, 140px)" },
      bunny: { left: "43%", bottom: "5%", width: "clamp(62px, 8vw, 105px)" }
    },
    default: {
      dog:   { left: "10%", bottom: "7%", width: "clamp(86px, 12vw, 155px)" },
      cat:   { right: "10%", bottom: "7%", width: "clamp(80px, 11vw, 140px)" },
      bunny: { left: "43%", bottom: "5%", width: "clamp(62px, 8vw, 105px)" }
    }
  };

  const animalDetails = {
    dog: { fallback: "Dog", reaction: "woof! ♡" },
    cat: { fallback: "Cat", reaction: "meowww *stretches*" },
    bunny: { fallback: "Bunny", reaction: "*jumps everywhere of happiness*" }
  };

  function showAnimalReaction(wrapper, animal) {
    // Animal companions can be clicked in every scene, even while Eevee's
    // main dialogue is open. Their own reaction appears as a separate bubble.
    const existing = wrapper.querySelector(".friend-reaction");
    if (existing) existing.remove();
    const reaction = document.createElement("span");
    reaction.className = "friend-reaction";
    reaction.textContent = animalDetails[animal].reaction;
    reaction.setAttribute("role", "status");
    wrapper.appendChild(reaction);
    window.clearTimeout(wrapper.reactionTimer);
    wrapper.reactionTimer = window.setTimeout(() => reaction.remove(), 2600);
  }

  function renderFriends() {
    sceneFriends.replaceChildren();
    const positions = friendPositions[state.place] || friendPositions.default;
    chosenAnimals().forEach((animal, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = `friend-card friend-card--${animal}`;
      wrapper.dataset.animal = animal;
      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("aria-label", `${state.names[animal] || animalDetails[animal].fallback}; drag to move, click to interact`);
      wrapper.style.animationDelay = `${index * 130}ms`;
      Object.assign(wrapper.style, positions[animal] || {});

      // Once moved, keep the animal at its custom position if the scene is re-rendered.
      const saved = state.friendCoordinates[animal];
      if (saved) {
        wrapper.style.left = `${saved.left}%`;
        wrapper.style.top = `${saved.top}%`;
        wrapper.style.right = "auto";
        wrapper.style.bottom = "auto";
      }

      const img = document.createElement("img");
      img.className = `friend friend--${animal}`;
      img.src = `assets/${animal}.png`;
      img.alt = "";
      img.draggable = false;
      img.onerror = () => {
        wrapper.remove();
        console.warn(`Could not load animal image: assets/${animal}.png`);
      };
      wrapper.appendChild(img);

      const name = document.createElement("span");
      name.className = "friend-name";
      name.textContent = state.names[animal] || animalDetails[animal].fallback;
      wrapper.appendChild(name);

      let pointerStart = null;
      let dragOffset = null;
      let moved = false;
      wrapper.addEventListener("pointerdown", event => {
        if (event.button !== 0 && event.pointerType !== "touch") return;
        const sceneRect = scene.getBoundingClientRect();
        const rect = wrapper.getBoundingClientRect();
        pointerStart = { x: event.clientX, y: event.clientY };
        dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        moved = false;
        wrapper.setPointerCapture(event.pointerId);
        wrapper.classList.add("is-dragging");
        wrapper.dataset.sceneWidth = String(sceneRect.width);
        wrapper.dataset.sceneHeight = String(sceneRect.height);
      });
      wrapper.addEventListener("pointermove", event => {
        if (!pointerStart || !dragOffset) return;
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        if (!moved && Math.hypot(dx, dy) < 6) return;
        moved = true;
        const sceneRect = scene.getBoundingClientRect();
        const maxLeft = Math.max(0, sceneRect.width - wrapper.offsetWidth);
        const maxTop = Math.max(0, sceneRect.height - wrapper.offsetHeight);
        const leftPx = Math.min(maxLeft, Math.max(0, event.clientX - sceneRect.left - dragOffset.x));
        const topPx = Math.min(maxTop, Math.max(0, event.clientY - sceneRect.top - dragOffset.y));
        wrapper.style.left = `${(leftPx / sceneRect.width) * 100}%`;
        wrapper.style.top = `${(topPx / sceneRect.height) * 100}%`;
        wrapper.style.right = "auto";
        wrapper.style.bottom = "auto";
        state.friendCoordinates[animal] = {
          left: (leftPx / sceneRect.width) * 100,
          top: (topPx / sceneRect.height) * 100
        };
      });
      const finishPointer = () => {
        if (!pointerStart) return;
        wrapper.classList.remove("is-dragging");
        pointerStart = null;
        dragOffset = null;
        if (moved) {
          wrapper.dataset.justDragged = "true";
          window.setTimeout(() => { delete wrapper.dataset.justDragged; }, 100);
        }
      };
      wrapper.addEventListener("pointerup", finishPointer);
      wrapper.addEventListener("pointercancel", finishPointer);
      wrapper.addEventListener("click", event => {
        if (wrapper.dataset.justDragged === "true") {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        showAnimalReaction(wrapper, animal);
      });
      wrapper.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showAnimalReaction(wrapper, animal);
        }
      });
      sceneFriends.appendChild(wrapper);
    });
    // Beach story characters are intentionally NOT rendered here.
    // They must appear only when their own story branch reaches their introduction.
  }

  const beachCharacterInfo = {
    pompompurin: { emoji: "🍮", name: "Pompompurin", className: "story-character--pompompurin", reaction: "Pompompom!" },
    pochacco: { emoji: "🐶", name: "Pochacco", className: "story-character--pochacco", reaction: "*looks at you gently*" },
    pikachu: { emoji: "⚡", name: "Pikachu", className: "story-character--pikachu", reaction: "Pika Pika!" },
    keroppi: { emoji: "🐸", name: "Keroppi", className: "story-character--keroppi", reaction: "Kero Kero!" },
    futaba: { emoji: "🎧", name: "Futaba", className: "story-character--futaba", reaction: "As a member of the same sex, I can sense a lot of charm from you Eve!" },
    klee: { emoji: "💥", name: "Klee", className: "story-character--klee", reaction: "Boom Boom Bakudan!" },
    hanako: { emoji: "👻", name: "Hanako", className: "story-character--hanako", reaction: "Go easy on me" },
    "hu-tao": { emoji: "🌸", name: "Hu Tao", className: "story-character--hu-tao", reaction: "One client, two clients, three clients, four clients!" },
    darthvader: { emoji: "🖤", name: "Darth Vader", className: "story-character--darthvader", reaction: "Eve, I’m your father" },
    chica: { emoji: "🐤", name: "Chica", className: "story-character--chica", reaction: "..? *smiles*" },
    paimon: { emoji: "⭐", name: "Paimon", className: "story-character--paimon", reaction: "Paimon is here!" },
    nene: { emoji: "🌸", name: "Nene Yashiro", className: "story-character--nene", reaction: "Ehehe, hello!" },
    madoka: { emoji: "🌷", name: "Madoka Kaname", className: "story-character--madoka", reaction: "I'm happy to be here with you!" },
    "mansion-item": { emoji: "✨", name: "Mystery item", className: "story-character--mansion-item", reaction: "A mysterious item!" },
    "eevee-heart": { emoji: "💛", name: "Eevee", className: "story-character--eevee-heart", reaction: "I’m so glad to know you!" }
  };

  function showBeachCharacterReaction(wrapper, key) {
    const info = beachCharacterInfo[key];
    const previous = wrapper.querySelector(".beach-character-reaction");
    if (previous) previous.remove();
    const bubble = document.createElement("span");
    bubble.className = "beach-character-reaction";
    bubble.textContent = info.reaction;
    bubble.setAttribute("role", "status");
    wrapper.appendChild(bubble);
    window.clearTimeout(wrapper.reactionTimer);
    wrapper.reactionTimer = window.setTimeout(() => bubble.remove(), 2800);
  }

  function makeBeachCharacterDraggable(wrapper, key) {
    let pointerStart = null;
    let dragOffset = null;
    let moved = false;

    wrapper.style.touchAction = "none";
    wrapper.style.userSelect = "none";
    wrapper.style.webkitUserSelect = "none";
    wrapper.addEventListener("pointerdown", event => {
      if (event.button !== 0 && event.pointerType !== "touch") return;
      event.preventDefault();
      const sceneRect = scene.getBoundingClientRect();
      const rect = wrapper.getBoundingClientRect();
      pointerStart = { x: event.clientX, y: event.clientY };
      dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      moved = false;
      wrapper.setPointerCapture(event.pointerId);
      wrapper.classList.add("is-dragging");
    });
    wrapper.addEventListener("pointermove", event => {
      if (!pointerStart || !dragOffset) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      const sceneRect = scene.getBoundingClientRect();
      const maxLeft = Math.max(0, sceneRect.width - wrapper.offsetWidth);
      const maxTop = Math.max(0, sceneRect.height - wrapper.offsetHeight);
      const leftPx = Math.min(maxLeft, Math.max(0, event.clientX - sceneRect.left - dragOffset.x));
      const topPx = Math.min(maxTop, Math.max(0, event.clientY - sceneRect.top - dragOffset.y));
      const left = (leftPx / sceneRect.width) * 100;
      const top = (topPx / sceneRect.height) * 100;
      wrapper.style.left = `${left}%`;
      wrapper.style.top = `${top}%`;
      wrapper.style.right = "auto";
      wrapper.style.bottom = "auto";
      state.beachCharacterCoordinates[key] = { left, top };
    });
    const finishPointer = () => {
      if (!pointerStart) return;
      wrapper.classList.remove("is-dragging");
      pointerStart = null;
      dragOffset = null;
      if (moved) {
        wrapper.dataset.justDragged = "true";
        window.setTimeout(() => { delete wrapper.dataset.justDragged; }, 140);
      }
    };
    wrapper.addEventListener("pointerup", finishPointer);
    wrapper.addEventListener("pointercancel", finishPointer);
    wrapper.addEventListener("click", event => {
      if (wrapper.dataset.justDragged === "true") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      showBeachCharacterReaction(wrapper, key);
    });
    wrapper.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showBeachCharacterReaction(wrapper, key);
      }
    });
  }

  function createBeachCharacterCard(key, left, index = 0) {
    const info = beachCharacterInfo[key];
    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = `story-character ${info.className} story-character--decor`;
    wrapper.dataset.beachCharacter = key;
    wrapper.setAttribute("aria-label", `${info.name}; drag to move, click to interact`);
    wrapper.title = `Drag ${info.name} to move, click to talk`;
    wrapper.style.left = `${left}%`;
    wrapper.style.right = "auto";
    wrapper.style.bottom = "6%";
    wrapper.style.width = "clamp(78px, 10vw, 130px)";
    wrapper.style.height = "clamp(90px, 13vw, 165px)";
    wrapper.style.animationDelay = `${index * 100}ms`;
    const saved = state.beachCharacterCoordinates[key];
    if (saved) {
      wrapper.style.left = `${saved.left}%`;
      wrapper.style.top = `${saved.top}%`;
      wrapper.style.bottom = "auto";
    }
    const sprite = document.createElement("img");
    sprite.className = "story-character-sprite";
    sprite.src = `assets/${key}.png`;
    sprite.alt = "";
    sprite.draggable = false;
    sprite.onerror = () => { sprite.remove(); wrapper.textContent = info.emoji; wrapper.classList.add("story-character--emoji-fallback"); };
    wrapper.appendChild(sprite);
    makeBeachCharacterDraggable(wrapper, key);
    sceneFriends.appendChild(wrapper);
    return wrapper;
  }

  function renderMansionCharacter(key, left, top, index = 0) {
    if (sceneFriends.querySelector(`[data-beach-character="${key}"]`)) return;
    const info = beachCharacterInfo[key];
    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = `story-character ${info.className} story-character--decor mansion-character`;
    wrapper.dataset.beachCharacter = key;
    wrapper.setAttribute("aria-label", `${info.name}; drag to move, click to interact`);
    wrapper.title = `Drag ${info.name} to move, click to talk`;
    // Use saved positions after dragging; otherwise use the layout position supplied by the scene.
    const saved = state.beachCharacterCoordinates[key];
    wrapper.style.left = `${saved ? saved.left : left}%`;
    wrapper.style.top = `${saved ? saved.top : top}%`;
    wrapper.style.right = "auto"; wrapper.style.bottom = "auto";
    wrapper.style.touchAction = "none";
    wrapper.style.userSelect = "none";
    wrapper.style.webkitUserSelect = "none";
    wrapper.style.width = key === "futaba" ? "clamp(90px, 12vw, 155px)" : (key === "hu-tao" || key === "darthvader" ? "clamp(90px, 13vw, 165px)" : (key === "madoka" || key === "nene" ? "clamp(78px, 10vw, 135px)" : (key === "paimon" ? "clamp(65px, 8vw, 105px)" : "clamp(75px, 10vw, 130px)")));
    wrapper.style.height = key === "futaba" ? "clamp(150px, 24vw, 270px)" : (key === "madoka" || key === "nene" ? "clamp(110px, 16vw, 190px)" : "clamp(90px, 13vw, 160px)");
    wrapper.style.animationDelay = `${index * 100}ms`;
    const sprite = document.createElement("img"); sprite.className = "story-character-sprite";
    sprite.src = key === "hu-tao" ? "assets/hu-tao.png" : `assets/${key}.png`; sprite.alt = ""; sprite.draggable = false;
    sprite.onerror = () => { sprite.remove(); wrapper.textContent = info.emoji; wrapper.classList.add("story-character--emoji-fallback"); };
    wrapper.appendChild(sprite); makeBeachCharacterDraggable(wrapper, key); sceneFriends.appendChild(wrapper);
  }

  function renderMansionCast(includeHanako = false) {
    updateBackground("mansion");
    renderMansionCharacter("klee", 12, 61, 0);
    renderMansionCharacter("futaba", 75, 43, 1);
    if (includeHanako) renderMansionCharacter("hanako", 47, 60, 2);
    if (state.step >= 17) renderMansionCharacter("hu-tao", 64, 57, 3);
    if (state.step >= 27) renderMansionCharacter("darthvader", 75, 44, 4);
    if (state.step >= 20 && state.mansionPath === "hanako") renderMansionCharacter("chica", 76, 58, 4);
  }

  function isolateMansionGameCast(keys) {
    const allowed = new Set(keys);
    sceneFriends.querySelectorAll("[data-beach-character]").forEach(el => {
      const key = el.dataset.beachCharacter;
      if (key !== "mansion-item" && !allowed.has(key)) el.remove();
    });
    // Leave any animal companions already present in the scene visible.
    ["dog", "cat", "bunny"].forEach(key => {
      const pet = sceneFriends.querySelector(`[data-beach-character="${key}"]`);
      if (pet) pet.style.display = "";
    });
  }

  function renderBeachDecorCharacters() {
    if (sceneFriends.querySelector("[data-beach-character]")) return;
    createBeachCharacterCard("pompompurin", 18, 0);
    createBeachCharacterCard("pochacco", 44, 1);
    createBeachCharacterCard("keroppi", 70, 2);
  }

  function renderStoryCharacter(character, revealAll = false) {
    // The three Sanrio friends are revealed together; Pikachu must only appear
    // when the concert scene explicitly calls renderPikachu().
    const characters = revealAll
      ? ["pompompurin", "pochacco", "keroppi"]
      : (character ? [character] : []);
    characters.forEach((key, index) => {
      const existing = sceneFriends.querySelector(`[data-beach-character="${key}"]`);
      if (existing) {
        if (!revealAll) {
          existing.classList.add("story-character--active");
          existing.style.left = "auto";
          existing.style.right = "3%";
          existing.style.bottom = "7%";
          existing.style.width = "clamp(100px, 14vw, 175px)";
          existing.style.height = "clamp(110px, 16vw, 205px)";
          existing.style.zIndex = "12";
        } else {
          existing.classList.add("story-character--group");
          if (!state.beachCharacterCoordinates[key]) {
            existing.style.left = `${24 + index * 25}%`;
            existing.style.right = "auto";
            existing.style.bottom = "6%";
          }
        }
        const saved = state.beachCharacterCoordinates[key];
        if (saved) {
          existing.style.left = `${saved.left}%`;
          existing.style.top = `${saved.top}%`;
          existing.style.right = "auto";
          existing.style.bottom = "auto";
        }
        return;
      }
      const info = beachCharacterInfo[key];
      const wrapper = document.createElement("button");
      wrapper.type = "button";
      wrapper.className = `story-character ${info.className}`;
      wrapper.dataset.beachCharacter = key;
      wrapper.style.pointerEvents = "auto";
      wrapper.setAttribute("aria-label", `${info.name}; drag to move, click to interact`);
      wrapper.title = `Drag ${info.name} to move, click to talk`;
      const sprite = document.createElement("img");
      sprite.className = "story-character-sprite";
      sprite.src = `assets/${key}.png`;
      sprite.alt = "";
      sprite.draggable = false;
      sprite.onerror = () => { sprite.remove(); wrapper.textContent = info.emoji; wrapper.classList.add("story-character--emoji-fallback"); };
      wrapper.appendChild(sprite);
      if (revealAll) {
        wrapper.classList.add("story-character--group");
        wrapper.style.left = `${24 + index * 25}%`;
        wrapper.style.right = "auto";
      }
      const saved = state.beachCharacterCoordinates[key];
      if (saved) {
        wrapper.style.left = `${saved.left}%`;
        wrapper.style.top = `${saved.top}%`;
        wrapper.style.right = "auto";
        wrapper.style.bottom = "auto";
      }
      makeBeachCharacterDraggable(wrapper, key);
      sceneFriends.appendChild(wrapper);
    });
  }
  function renderPikachu() {
    if (sceneFriends.querySelector('[data-beach-character="pikachu"]')) return;
    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = "story-character story-character--pikachu concert-pikachu";
    wrapper.dataset.beachCharacter = "pikachu";
    wrapper.style.pointerEvents = "auto";
    wrapper.setAttribute("aria-label", "Pikachu; drag to move, click to interact");
    wrapper.title = "Drag Pikachu to move, click for Pika Pika!";
    const saved = state.beachCharacterCoordinates.pikachu;
    if (saved) {
      wrapper.style.left = `${saved.left}%`;
      wrapper.style.top = `${saved.top}%`;
      wrapper.style.right = "auto";
      wrapper.style.bottom = "auto";
    }
    const sprite = document.createElement("img");
    sprite.className = "story-character-sprite";
    sprite.src = "assets/pikachu.png";
    sprite.alt = "";
    sprite.draggable = false;
    sprite.onerror = () => console.warn("Could not load assets/pikachu.png");
    wrapper.appendChild(sprite);
    makeBeachCharacterDraggable(wrapper, "pikachu");
    sceneFriends.appendChild(wrapper);
  }

  const karaokeSongs = {
    "monster": {
      title: "Monster",
      file: "assets/monster.mp3"
    },
    "caraphernelia": {
      title: "Caraphernelia — Pierce the Veil",
      file: "assets/caraphernelia.mp3"
    },
    "no-more-what-ifs": {
      title: "No More What Ifs — Persona 5 Royal",
      file: "assets/no-more-what-ifs.mp3"
    }
  };

  function openKaraoke() {
    const song = karaokeSongs[state.beachSong];
    if (!song) return;
    karaokeOverlay.classList.remove("is-hidden");
    karaokeTitle.textContent = "Just write the lyrics here!";
    karaokeSongName.textContent = song.title;
    karaokeAudioNote.textContent = "";
    karaokeAudio.pause();
    karaokeAudio.src = song.file;
    karaokeAudio.load();
    const playAttempt = karaokeAudio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        karaokeAudioNote.textContent = "If the music does not start, press play in your browser or check that the audio is enabled.";
      });
    }
  }

  function closeKaraoke() {
    karaokeAudio.pause();
    karaokeOverlay.classList.add("is-hidden");
    goToStep(134);
  }

  karaokeSkip.addEventListener("click", closeKaraoke);
  karaokeAudio.addEventListener("error", () => {
    if (karaokeOverlay.classList.contains("is-hidden")) return;
    const song = karaokeSongs[state.beachSong];
    if (song) karaokeAudioNote.textContent = "The audio could not be loaded. Try refreshing the page.";
  });
  karaokeAudio.addEventListener("ended", () => {
    karaokeAudio.pause();
    karaokeOverlay.classList.add("is-hidden");
    goToStep(134);
  });

  function renderBeachCharacterForStep(step) {
    const pompompurinSteps = [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74];
    const pochaccoSteps = [81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94];
    const keroppiSteps = [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    if (pompompurinSteps.includes(step)) renderStoryCharacter("pompompurin");
    else if (pochaccoSteps.includes(step)) renderStoryCharacter("pochacco");
    else if (keroppiSteps.includes(step)) renderStoryCharacter("keroppi");
  }

  const sceneItemDetails = {
    twilight: { src: "assets/twilight-sparkle.png", alt: "Twilight Sparkle", className: "scene-object--twilight", width: "clamp(105px, 13vw, 175px)", left: 34, top: 40 },
    "white-peach": { src: "assets/drink-white-peach.png", alt: "A white peach Red Bull", className: "scene-object--can", width: "clamp(42px, 5.5vw, 72px)", left: 31, top: 63 },
    tea: { src: "assets/drink-tea.png", alt: "A cup of hot tea", className: "scene-object--tea", width: "clamp(90px, 10vw, 132px)", left: 31, top: 65 },
    water: { src: "assets/drink-water.png", alt: "A glass of water", className: "scene-object--water", width: "clamp(48px, 6vw, 78px)", left: 31, top: 61 },
    lasagna: { src: "assets/food-lasagna.png", alt: "A serving of lasagna", className: "scene-object--lasagna", width: "clamp(115px, 15vw, 190px)", left: 47, top: 67 },
    cake: { src: "assets/food-cake.png", alt: "A slice of chocolate cake with raspberries", className: "scene-object--cake", width: "clamp(100px, 13vw, 165px)", left: 48, top: 62 },
    strawberries: { src: "assets/food-strawberries.png", alt: "Fresh strawberries", className: "scene-object--strawberries", width: "clamp(78px, 10vw, 125px)", left: 48, top: 66 }
  };

  function showSceneItemReaction(wrapper, key) {
    if (!state.dialogueClosed || key !== "twilight") return;
    const existing = wrapper.querySelector(".scene-item-reaction");
    if (existing) existing.remove();
    const reaction = document.createElement("span");
    reaction.className = "scene-item-reaction";
    reaction.textContent = "I'm now with the best person ever! All according to plan.";
    reaction.setAttribute("role", "status");
    wrapper.appendChild(reaction);
    window.clearTimeout(wrapper.reactionTimer);
    wrapper.reactionTimer = window.setTimeout(() => reaction.remove(), 3200);
  }

  function renderSceneItems() {
    sceneItems.replaceChildren();
    const selected = ["twilight", state.drink, state.food].filter(Boolean);
    if (state.invoked && state.step >= 15) selected.push("summoned");
    selected.forEach((key, index) => {
      const detail = key === "summoned"
        ? { src: `assets/${state.invoked}.png`, alt: state.invoked, className: "scene-object--summoned", width: "clamp(125px, 17vw, 225px)", left: 4, top: 31 }
        : sceneItemDetails[key];
      if (!detail) return;
      const wrapper = document.createElement("div");
      wrapper.className = `scene-object ${detail.className}`;
      wrapper.dataset.item = key;
      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("aria-label", `${detail.alt}; drag to move`);
      wrapper.style.width = detail.width;
      // Speaking guests stand to the RIGHT of the dialogue bubble.
      // The bubble tail is mirrored for them in setDialogue().
      const isGuestSpeaker = key === "twilight" || key === "summoned";
      const isSpeaking = (key === "twilight" && state.step === 10) ||
        (key === "summoned" && [15, 17, 19, 23, 24, 25, 27, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43].includes(state.step));
      if (isGuestSpeaker) {
        wrapper.style.left = "auto";
        wrapper.style.right = window.innerWidth <= 650 ? "1%" : "3%";
        wrapper.style.top = key === "summoned" ? (window.innerWidth <= 650 ? "31%" : "29%") : (window.innerWidth <= 650 ? "40%" : "37%");
      } else {
        wrapper.style.left = `${detail.left}%`;
        wrapper.style.top = `${detail.top}%`;
      }
      if (isSpeaking) wrapper.classList.add("scene-object--speaking");
      wrapper.style.animationDelay = `${index * 110}ms`;

      const saved = state.sceneItemCoordinates[key];
      if (saved) {
        wrapper.style.left = `${saved.left}%`;
        wrapper.style.top = `${saved.top}%`;
      }

      const img = document.createElement("img");
      img.src = detail.src;
      img.alt = detail.alt;
      img.draggable = false;
      img.onerror = () => {
        wrapper.remove();
        console.warn(`Could not load scene item image: ${detail.src}`);
      };
      wrapper.appendChild(img);

      let pointerStart = null;
      let dragOffset = null;
      let moved = false;
      wrapper.addEventListener("pointerdown", event => {
        if (event.button !== 0 && event.pointerType !== "touch") return;
        const sceneRect = scene.getBoundingClientRect();
        const rect = wrapper.getBoundingClientRect();
        pointerStart = { x: event.clientX, y: event.clientY };
        dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        moved = false;
        wrapper.setPointerCapture(event.pointerId);
        wrapper.classList.add("is-dragging");
      });
      wrapper.addEventListener("pointermove", event => {
        if (!pointerStart || !dragOffset) return;
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        if (!moved && Math.hypot(dx, dy) < 6) return;
        moved = true;
        const sceneRect = scene.getBoundingClientRect();
        const maxLeft = Math.max(0, sceneRect.width - wrapper.offsetWidth);
        const maxTop = Math.max(0, sceneRect.height - wrapper.offsetHeight);
        const leftPx = Math.min(maxLeft, Math.max(0, event.clientX - sceneRect.left - dragOffset.x));
        const topPx = Math.min(maxTop, Math.max(0, event.clientY - sceneRect.top - dragOffset.y));
        const left = (leftPx / sceneRect.width) * 100;
        const top = (topPx / sceneRect.height) * 100;
        wrapper.style.left = `${left}%`;
        wrapper.style.top = `${top}%`;
        state.sceneItemCoordinates[key] = { left, top };
      });
      const finishPointer = () => {
        if (!pointerStart) return;
        wrapper.classList.remove("is-dragging");
        pointerStart = null;
        dragOffset = null;
        if (moved) {
          wrapper.dataset.justDragged = "true";
          window.setTimeout(() => { delete wrapper.dataset.justDragged; }, 120);
        }
      };
      wrapper.addEventListener("pointerup", finishPointer);
      wrapper.addEventListener("pointercancel", finishPointer);
      wrapper.addEventListener("click", event => {
        if (wrapper.dataset.justDragged === "true") {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        wrapper.classList.toggle("is-selected");
        showSceneItemReaction(wrapper, key);
      });
      wrapper.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          wrapper.classList.toggle("is-selected");
          showSceneItemReaction(wrapper, key);
        }
      });
      sceneItems.appendChild(wrapper);
    });
  }

  function createNameInputs() {
    nameEntry.replaceChildren();
    chosenAnimals().forEach(animal => {
      const label = document.createElement("label");
      label.textContent = animal === "cat" ? "Cat's name" : animal === "bunny" ? "Bunny's name" : "Dog's name";
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 24;
      input.placeholder = "Choose a name…";
      input.id = `name-${animal}`;
      input.value = state.names[animal] || "";
      input.autocomplete = "off";
      input.addEventListener("input", () => { state.names[animal] = input.value.trim(); });
      label.appendChild(input);
      nameEntry.appendChild(label);
    });
  }

  function setDialogueClosed(closed) {
    state.dialogueClosed = closed;
    scene.classList.toggle("dialogue-is-closed", closed);
    eeveeToggle.setAttribute("aria-label", closed ? "Reopen Eevee's dialogue" : "Close Eevee's dialogue");
    guideHint.textContent = closed ? "Click Eevee to talk again ♡" : "Click Eevee to hide the dialogue ♡";
    if (!closed) {
      // The panel is open; keep the current step and selected answers unchanged.
      dialoguePanel.focus?.({ preventScroll: true });
    }
  }

  function renderFinalReunion() {
    updateBackground("final");
    renderFriends();
    renderStoryCharacter(null, true);
    renderPikachu();
    renderMansionCharacter("klee", 3, 55, 0);
    renderMansionCharacter("futaba", 15, 28, 1);
    renderMansionCharacter("hanako", 27, 58, 2);
    renderMansionCharacter("chica", 38, 31, 3);
    renderMansionCharacter("hu-tao", 49, 57, 4);
    renderMansionCharacter("darthvader", 61, 28, 5);
    renderMansionCharacter("madoka", 70, 57, 6);
    renderMansionCharacter("paimon", 80, 29, 7);
    renderMansionCharacter("nene", 88, 58, 8);
    renderSceneItems();
  }

  function renderFinalEevee() {
    // A draggable Eevee companion appears above the gifts once all story dialogue is complete.
    const existing = sceneFriends.querySelector('[data-beach-character="eevee-heart"]');
    if (existing) return existing;
    const info = beachCharacterInfo["eevee-heart"];
    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = `story-character ${info.className} story-character--group`;
    wrapper.dataset.beachCharacter = "eevee-heart";
    wrapper.setAttribute("aria-label", "Eevee; drag to move, click to hear a message");
    wrapper.title = "Drag Eevee to move, click to talk";
    wrapper.style.left = state.beachCharacterCoordinates["eevee-heart"] ? `${state.beachCharacterCoordinates["eevee-heart"].left}%` : "45%";
    wrapper.style.top = state.beachCharacterCoordinates["eevee-heart"] ? `${state.beachCharacterCoordinates["eevee-heart"].top}%` : "2%";
    wrapper.style.right = "auto";
    wrapper.style.bottom = "auto";
    wrapper.style.width = "clamp(100px, 14vw, 170px)";
    wrapper.style.height = "clamp(105px, 15vw, 180px)";
    wrapper.style.zIndex = "70";
    const sprite = document.createElement("img");
    sprite.className = "story-character-sprite";
    sprite.src = "assets/eevee-heart.png";
    sprite.alt = "Eevee holding a heart";
    sprite.draggable = false;
    wrapper.appendChild(sprite);
    makeBeachCharacterDraggable(wrapper, "eevee-heart");
    sceneFriends.appendChild(wrapper);
    return wrapper;
  }

  function renderFinalGifts() {
    sceneItems.replaceChildren();
    renderFinalEevee();
    const gifts = [
      { key: "final-bouquet", src: "assets/final-bouquet.png", alt: "A bouquet of yellow flowers", left: "28%", top: "34%", width: "clamp(150px, 22vw, 270px)" },
      { key: "final-envelope", src: "assets/final-envelope.png", alt: "A pink envelope with a heart; click to open the letter", left: "53%", top: "40%", width: "clamp(130px, 19vw, 230px)" }
    ];
    gifts.forEach(gift => {
      const wrapper = document.createElement("button");
      wrapper.type = "button";
      wrapper.className = `final-gift final-gift--${gift.key}`;
      wrapper.style.left = gift.left;
      wrapper.style.top = gift.top;
      wrapper.style.width = gift.width;
      wrapper.setAttribute("aria-label", gift.alt);
      const img = document.createElement("img");
      img.src = gift.src;
      img.alt = gift.alt;
      img.draggable = false;
      wrapper.appendChild(img);
      if (gift.key === "final-envelope") {
        wrapper.addEventListener("click", () => letterOverlay.classList.remove("is-hidden"));
      }
      sceneItems.appendChild(wrapper);
    });
  }

  function goToStep(step) {
    scene.classList.remove("final-gifts-screen");
    dialogueColumn.classList.remove("is-hidden");
    state.step = step;
    playGameButton.classList.add("is-hidden");
    continueButton.classList.remove("is-hidden");
    clearChoices();
    continueButton.disabled = false;
    continueButton.classList.remove("is-hidden");
    backButton.classList.toggle("is-hidden", step === 0);
    eeveeGuide.src = "assets/eevee-portrait.jpeg";
    eeveeGuide.alt = "Eevee, your little guide";
    sceneFriends.replaceChildren();
    sceneItems.replaceChildren();
    setDialogueClosed(false);

    if (step >= 4) renderFriends();

    if (step === 0) {
      setDialogue("Hiiii, I have heard that things weren't at their best for you and so I wanted to take you for a little trip! Just follow me!");
      continueButton.textContent = "Let's go →";
    } else if (step === 1) {
      setDialogue("First of all, is there any place you would rather go?");
      showChoices(places, state.place, value => {
        state.place = value;
        continueButton.disabled = false;
      });
      continueButton.textContent = "Let's travel →";
      continueButton.disabled = !state.place;
    } else if (step === 2) {
      setDialogue("Let's travel here then! I am very happy to go there with you. I hope you will enjoy this little moment together. I have other surprises for you!");
      continueButton.textContent = "We're here! →";
    } else if (step === 3) {
      setDialogue("Now that we're here, would you like to invite some friends?");
      showChoices(friendChoices, state.friends[0] || "", value => {
        state.friends = value === "all" ? ["all"] : [value];
        continueButton.disabled = false;
      });
      continueButton.textContent = "Invite them →";
      continueButton.disabled = state.friends.length === 0;
    } else if (step === 4) {
      setDialogue("Look at them, they are so happy to see you! Take time to pet them, they really love your presence and they feel safe when you're around. Maybe you can give them a name?");
      showChoices(
        [{ value: "yes", label: "Sure! ♡" }, { value: "no", label: "No, thanks!" }],
        state.naming ? "yes" : "no",
        value => { state.naming = value === "yes"; continueButton.disabled = false; }
      );
      continueButton.textContent = "Continue →";
    } else if (step === 5) {
      setDialogue("What would you like to call your little friends?");
      createNameInputs();
      continueButton.textContent = "Finish ♡";
    } else if (step === 6 && state.place === "lake") {
      updateBackground("lake");
      setDialogue("Even though we are not alone.. this is pretty scary here..");
      continueButton.textContent = "Continue →";
    } else if (step === 7 && state.place === "lake") {
      updateBackground("lake");
      setDialogue("BOOOOOOO!", "summoned");
      renderMansionCharacter("klee", 12, 61, 0); renderMansionCharacter("futaba", 75, 43, 1);
      continueButton.textContent = "AAAAAAAH!! →";
    } else if (step === 8 && state.place === "lake") {
      updateBackground("lake"); renderMansionCharacter("klee", 12, 61, 0); renderMansionCharacter("futaba", 75, 43, 1);
      setDialogue("Don't panic little Evee, it's just us!!", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 9 && state.place === "lake") {
      updateBackground("lake"); renderMansionCharacter("klee", 12, 61, 0); renderMansionCharacter("futaba", 75, 43, 1);
      setDialogue("Yes yes, no need to worry, we just wanted to make a little joke!"); continueButton.textContent = "Continue →";
    } else if (step === 10 && state.place === "lake") {
      updateBackground("lake"); renderMansionCharacter("klee", 12, 61, 0); renderMansionCharacter("futaba", 75, 43, 1);
      setDialogue("Phew.. I thought I was going to die.."); continueButton.textContent = "Continue →";
    } else if (step === 11 && state.place === "lake") {
      updateBackground("lake"); renderMansionCharacter("klee", 12, 61, 0); renderMansionCharacter("futaba", 75, 43, 1);
      setDialogue("What are you doing here? Would you like to visit this Haunted Mansion with us?"); continueButton.textContent = "Continue →";
    } else if (step === 12 && state.place === "lake") {
      updateBackground("lake"); renderMansionCharacter("klee", 12, 61, 0); renderMansionCharacter("futaba", 75, 43, 1);
      setDialogue("H-Haunted??"); continueButton.textContent = "Continue →";
    } else if (step === 13 && state.place === "lake") {
      updateBackground("lake"); renderMansionCharacter("klee", 12, 61, 0); renderMansionCharacter("futaba", 75, 43, 1);
      setDialogue("Yes! Look behind you, there is a haunted place there.. I have heard there were lots of mysteries in there!");
      showChoices([{value:"go",label:"Let's go there!"},{value:"scared",label:"I'm scared but well.. I guess we can still try it?"}], state.reunionChoice, value => { state.reunionChoice=value; continueButton.disabled=false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.reunionChoice;
    } else if (step === 14 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true);
      setDialogue("Yayyy! I am glad to hear that! Follow me here!", "summoned"); continueButton.textContent = "Follow →";
    } else if (step === 15 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true);
      setDialogue("Hello everyone! I will be your guide for today's trip hehehehehe", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 16 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true);
      setDialogue("N-nice to meet you Hanako! You remind me of someone..", "eevee"); continueButton.textContent = "Continue →";
    } else if (step === 17 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); renderMansionCharacter("hu-tao",64,57,3);
      setDialogue("Are you talking about me, Evee?", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 18 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); renderMansionCharacter("hu-tao",64,57,3);
      setDialogue("AAAAAAH YES!!!", "eevee"); continueButton.textContent = "Continue →";
    } else if (step === 19 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); renderMansionCharacter("hu-tao",64,57,3);
      setDialogue("Don't scare me again like that please..", "eevee"); continueButton.textContent = "Continue →";
    } else if (step === 20 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); renderMansionCharacter("hu-tao",64,57,3);
      setDialogue("I will be guiding you as well! Well, we both have to show you something actually..", "summoned");
      showChoices([{value:"hanako",label:"Follow Hanako"},{value:"hutao",label:"Follow Hu Tao"}],state.mansionPath,value=>{state.mansionPath=value; state.mansionFirstPath=value; state.mansionGamesPlayed=[]; state.hideRounds=0; state.hideChoice=""; state.hideCaught=false; state.mansionGameComplete=false; state.boxChoice=""; continueButton.disabled=false;});
      continueButton.textContent="Choose →"; continueButton.disabled=!state.mansionPath;
    } else if (step === 21 && state.place === "lake") {
      updateBackground("mansion");
      if (state.mansionPath === "hanako") {
        isolateMansionGameCast(["hanako","chica"]); renderMansionCharacter("hanako",47,60,2); renderMansionCharacter("chica",76,58,4);
        setDialogue("We will play something together, with one of my friends: Chica!", "summoned");
      } else {
        isolateMansionGameCast(["hu-tao","darthvader"]); renderMansionCharacter("hu-tao",64,57,3); renderMansionCharacter("darthvader",75,44,4);
        setDialogue("*breathes loudly*", "summoned");
      }
      continueButton.textContent="Continue →";
    } else if (step === 22 && state.place === "lake") {
      updateBackground("mansion");
      if (state.mansionPath === "hanako") { isolateMansionGameCast(["hanako","chica"]); renderMansionCharacter("hanako",47,60,2); renderMansionCharacter("chica",76,58,4); setDialogue("Choose one of the nine hiding places. We'll play three rounds.","summoned"); showMansionHidingGrid(); continueButton.textContent="Hide! →"; continueButton.disabled=!state.hideChoice; }
      else { isolateMansionGameCast(["hu-tao","darthvader"]); renderMansionCharacter("hu-tao",64,57,3); renderMansionCharacter("darthvader",75,44,4); setDialogue("You can’t run away anyway!", "summoned"); continueButton.textContent="Continue →"; }
    } else if (step === 23 && state.place === "lake") {
      updateBackground("mansion");
      if (state.mansionPath === "hanako") {
        isolateMansionGameCast(["hanako","chica"]); renderMansionCharacter("hanako",47,60,2); renderMansionCharacter("chica",76,58,4);
        state.chicaChoice=String(1+Math.floor(Math.random()*9)); state.hideCaught = state.hideChoice===state.chicaChoice;
        setDialogue(state.hideCaught ? "Chica found you!" : `You escaped Chica this round! She checked hiding place ${state.chicaChoice}.`,"summoned"); continueButton.textContent="Next round →";
      } else {
        isolateMansionGameCast(["hu-tao","darthvader"]); renderMansionCharacter("hu-tao",64,57,3); renderMansionCharacter("darthvader",75,44,4);
        setDialogue("Choose one of the three boxes!", "summoned"); showMansionBoxGrid(); continueButton.textContent="Choose a box →"; continueButton.disabled=!state.boxChoice;
      }
    } else if (step === 24 && state.place === "lake") {
      updateBackground("mansion");
      if (state.mansionPath === "hanako") {
        isolateMansionGameCast(["hanako","chica"]); renderMansionCharacter("hanako",47,60,2); renderMansionCharacter("chica",76,58,4);
        if (!state.mansionGameComplete) {
          state.hideRounds=(state.hideRounds||0)+1;
          if (state.hideCaught || state.hideRounds>=3) {
            state.mansionGameComplete=true;
            if (!state.mansionGamesPlayed.includes("hanako")) state.mansionGamesPlayed.push("hanako");
            const caughtLine = state.hideCaught ? "Chica: !!! Eevee: NOOOO!!" : "You survived all three rounds! Chica couldn't find you!";
            if (state.mansionGamesPlayed.includes("hutao")) {
              setDialogue(`${caughtLine} *Hanako laughs* Don't worry! Nothing will happen. It was just to scare you! That's so mean! But you are in a haunted house, what did you think would happen?`, "summoned");
              continueButton.textContent="Continue →";
            } else {
              setDialogue(`${caughtLine} *Hanako laughs* Don't worry! Nothing will happen. It was just to scare you! That's so mean! But you are in a haunted house, what did you think would happen? I'm done with you guys! Maybe you should join Hu Tao now?`, "summoned");
              showChoices([{value:"next",label:"I'm ready to join Hu Tao!"},{value:"wait",label:"Not yet…"}],state.mansionAfterPath,value=>{state.mansionAfterPath=value;continueButton.disabled=false;});
              continueButton.textContent="Continue →"; continueButton.disabled=!state.mansionAfterPath;
            }
          } else { state.hideChoice=""; setDialogue(`Round ${state.hideRounds} complete! Ready for round ${state.hideRounds+1}?`,"summoned"); showMansionHidingGrid(); continueButton.textContent="Choose a hiding place →"; continueButton.disabled=true; }
        } else if (state.mansionGamesPlayed.includes("hutao")) {
          setDialogue("Both adventures are complete! Thank you for exploring the mansion with us. ♡", "eevee"); continueButton.textContent="Continue →";
        } else {
          setDialogue("*Hanako laughs* Don't worry! Nothing will happen. It was just to scare you!", "summoned");
          showChoices([{value:"next",label:"I'm ready to join Hu Tao!"},{value:"wait",label:"Not yet…"}],state.mansionAfterPath,value=>{state.mansionAfterPath=value;continueButton.disabled=false;});
          continueButton.textContent="Continue →"; continueButton.disabled=!state.mansionAfterPath;
        }
      } else {
        isolateMansionGameCast(["hu-tao","darthvader","mansion-item"]); renderMansionCharacter("hu-tao",64,57,3); renderMansionCharacter("darthvader",75,44,4);
        const item=state.boxChoice==="box1"?"a red lightsaber":state.boxChoice==="box2"?"a magic wand":"nothing at all";
        const oldItem = sceneFriends.querySelector('[data-beach-character="mansion-item"]'); if (oldItem) oldItem.remove();
        const wrapper=document.createElement("button"); wrapper.type="button"; wrapper.className="story-character story-character--decor mansion-character mansion-reveal-item"; wrapper.dataset.beachCharacter="mansion-item"; wrapper.setAttribute("aria-label",`${item}; drag to move, click to interact`); wrapper.title="Drag this item to move it, click to interact";
        const img=document.createElement("img"); img.className="story-character-sprite"; img.alt=item; img.src=state.boxChoice==="box1"?"assets/lightsaber.png":state.boxChoice==="box2"?"assets/magic-wand.png":"assets/box.png"; wrapper.appendChild(img); makeBeachCharacterDraggable(wrapper,"mansion-item"); sceneFriends.appendChild(wrapper);
        if (!state.mansionGamesPlayed.includes("hutao")) state.mansionGamesPlayed.push("hutao");
        if (state.mansionGamesPlayed.includes("hanako")) {
          setDialogue("Evee: AAAAAAAAAH! Hu Tao: Stop screaming! Nothing will happen, it’s just funny to scare you! Evee: I'm about to cry.. Hu Tao: I'm sorry!", "summoned"); continueButton.textContent="Continue →";
        } else {
          setDialogue("Evee: AAAAAAAAAH! Hu Tao: Stop screaming! Nothing will happen, it’s just funny to scare you! Evee: I'm about to cry.. Hu Tao: I'm sorry! You should join Hanako now!", "summoned");
          showChoices([{value:"next",label:"Join Hanako"},{value:"wait",label:"Wait a moment"}],state.mansionAfterPath,value=>{state.mansionAfterPath=value;continueButton.disabled=false;});
          continueButton.textContent="Continue →"; continueButton.disabled=!state.mansionAfterPath;
        }
      }
    } else if (step === 25 && state.place === "lake") {
      goToStep(43);
    } else if (step === 50 && state.place === "lake") {
      // The lake route must end in the same shared surprise room as every other route.
      updateBackground("final");
      renderFriends();
      renderStoryCharacter(null, true);
      renderPikachu();
      const reunionPositions = {
        klee: [3, 55], futaba: [14, 27], hanako: [25, 58], chica: [36, 34],
        "hu-tao": [46, 57], darthvader: [57, 28], madoka: [68, 57],
        paimon: [78, 29], nene: [88, 57]
      };
      // The lake route has its own final-scene branch, so explicitly add every guest here too.
      // This must not depend on whether the bedroom route or a summon was selected.
      Object.entries(reunionPositions).forEach(([key, pos], index) => {
        renderMansionCharacter(key, pos[0], pos[1], index);
      });
      renderSceneItems();
      setDialogue("SURPRISE!", "eevee");
      continueButton.classList.add("is-hidden");
      backButton.classList.add("is-hidden");
      footerNote.textContent = "Eve’s bizarre adventures ♡";
    } else if (step >= 43 && step <= 49 && state.place === "lake") {
      updateBackground("mansion");
      renderFriends();
      sceneFriends.querySelectorAll("[data-beach-character]").forEach(el => el.remove());
      ["klee","futaba","hu-tao","hanako","darthvader","chica"].forEach((key, i) => {
        const positions = {klee:[10,59], futaba:[25,48], "hu-tao":[43,58], hanako:[58,59], darthvader:[73,43], chica:[82,62]};
        renderMansionCharacter(key, positions[key][0], positions[key][1], i);
      });
      const reunionLines = {
        43: ["I don't really know if I had fun..", "eevee"],
        44: ["I did myself!", "summoned"],
        45: ["Me too!", "summoned"],
        46: ["Well.. we deserve something after that right?", "eevee"],
        47: ["Of course we do!", "eevee"],
        48: ["It was all part of the plan! Now Klee has to show you something! Just tell us when you are ready!", "summoned"],
        49: ["Ready when you are! ♡", "eevee"]
      };
      const [line, speaker] = reunionLines[step];
      setDialogue(line, speaker);
      if (step === 47) {
        showChoices([{value:"yes",label:"Of course we do!"}], state.reunionChoice, value => { state.reunionChoice=value; continueButton.disabled=false; });
        continueButton.textContent="Continue →";
        continueButton.disabled=!state.reunionChoice;
      } else if (step === 49) {
        continueButton.textContent="Ready to go! →";
      } else {
        continueButton.textContent="Continue →";
      }
    } else if (step >= 30 && step <= 35 && state.place === "lake") {
      updateBackground("mansion"); isolateMansionGameCast(["hanako","chica"]); renderMansionCharacter("hanako",47,60,2); renderMansionCharacter("chica",76,58,4);
      const lines = ["Chica: ...", "H-hello Chica.. *she looks so scary*", "We will play a special game!", "What is it about..?", "Chica will try to kill you and you will have to avoid her attacks!!", "WHATTTTT?!"];
      setDialogue(lines[step-30], step===31 || step===33 || step===35 ? "eevee" : "summoned"); continueButton.textContent="Continue →";
    } else if (step >= 36 && step <= 42 && state.place === "lake") {
      updateBackground("mansion"); isolateMansionGameCast(["hu-tao","darthvader"]); renderMansionCharacter("hu-tao",64,57,3); renderMansionCharacter("darthvader",75,44,4);
      const lines = ["A-are you okay?", "*breathes loudly*", "Don't worry about him! Do you want to play our special game?", "What kind of game is it?", "Very easy! You have to choose between those three boxes and Darth Vader will attack you with the thing you choose!", "WHAT IS THAT STUPID GAME?!", "You can't run away anyway!"];
      setDialogue(lines[step-36], [0,3,5].includes(step-36) ? "eevee" : "summoned"); continueButton.textContent="Continue →";
    } else if (step === 26 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); renderMansionCharacter("darthvader",75,44,4); setDialogue("*breathes loudly*", "summoned"); continueButton.textContent="Continue →";
    } else if (step === 27 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); renderMansionCharacter("darthvader",75,44,4); setDialogue("A-gre you okay?", "eevee"); continueButton.textContent="Continue →";
    } else if (step === 28 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); renderMansionCharacter("hu-tao",64,57,3); setDialogue("Don't worry about him! Do you want to play our special game?", "summoned"); continueButton.textContent="Continue →";
    } else if (step === 29 && state.place === "lake") {
      updateBackground("mansion"); renderMansionCast(true); setDialogue("We'll write the final scene together soon! ♡", "eevee"); continueButton.textContent="Back to the mansion →";
    } else if (step === 6 && state.place === "room") {
      setDialogue("You must be hungry or thirsty after this walk and after playing with those cuties! Would you like to drink something?");
      showChoices(drinkChoices, state.drink, value => {
        state.drink = value;
        continueButton.disabled = false;
      });
      continueButton.textContent = "Choose a snack →";
      continueButton.disabled = !state.drink;
    } else if (step === 7 && state.place === "room") {
      setDialogue("Also, I've got some food for you, what do you want?");
      showChoices(foodChoices, state.food, value => {
        state.food = value;
        continueButton.disabled = false;
      });
      continueButton.textContent = "Let's get it →";
      continueButton.disabled = !state.food;
    } else if (step === 8 && state.place === "room") {
      setDialogue("I will get that for you, be right back!");
      continueButton.textContent = "Okay! ♡";
    } else if (step === 9 && state.place === "room") {
      setDialogue("Look at who I met while getting your food and your drink!!");
      continueButton.textContent = "Who is it? →";
    } else if (step === 10 && state.place === "room") {
      renderSceneItems();
      setDialogue("Hi! I wanted to get some food as well, can we spend that lovely snack together?", "twilight");
      continueButton.textContent = "Of course! →";
    } else if (step === 11 && state.place === "room") {
      renderSceneItems();
      setDialogue("Sure! I don't think Eve minds, put everything here!");
      continueButton.textContent = "Enjoy your snack ♡";
    } else if (step === 12 && state.place === "room") {
      renderSceneItems();
      setDialogue("Here we are! Your little snack is ready. You can move the treats and Twilight around to make this little room yours. ♡");
      continueButton.textContent = "Enjoy your snack ♡";
    } else if (step === 13 && state.place === "room") {
      renderSceneItems();
      setDialogue("Take the time you need with that well-deserved food! I hope you're having a good time with everyone now. When you're ready, let me know. ♡");
      continueButton.textContent = "I'm ready! →";
    } else if (step === 14 && state.place === "room") {
      renderSceneItems();
      setDialogue("Should we play something now? I have an idea if you want to!");
      continueButton.classList.add("is-hidden");
      playGameButton.classList.remove("is-hidden");
    } else if (step === 15 && state.place === "room") {
      renderSceneItems();
      setDialogue("Oh my days, how did I get here??", "summoned");
      continueButton.textContent = "What is happening? →";
    } else if (step === 16 && state.place === "room") {
      renderSceneItems();
      setDialogue("Wow, it sounds so real! How does my game look so real? It's scary!!");
      continueButton.textContent = "Continue →";
    } else if (step === 17 && state.place === "room") {
      renderSceneItems();
      setDialogue("Don't be scared!! I am not mean!!", "summoned");
      continueButton.textContent = "What should I do? →";
    } else if (step === 18 && state.place === "room") {
      renderSceneItems();
      setDialogue("They look a little worried. What will you do?");
      showChoices(
        [{ value: "attack", label: "Attack" }, { value: "nothing", label: "Do nothing" }],
        state.gameChoice,
        value => { state.gameChoice = value; continueButton.disabled = false; }
      );
      continueButton.textContent = "Choose →";
      continueButton.disabled = !state.gameChoice;
    } else if (step === 19 && state.place === "room") {
      renderSceneItems();
      setDialogue("AAAAAAAAAA I AM NOT MEAN I SAID IM NOT MEAN!!!!!! YOU MUST BE EVE RIGHT?? I AM NOT HERE TO CAUSE YOU ANY TROUBLE!!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 20 && state.place === "room") {
      renderSceneItems();
      setDialogue("...");
      continueButton.textContent = "... →";
    } else if (step === 21 && state.place === "room") {
      renderSceneItems();
      setDialogue("...");
      continueButton.textContent = "... →";
    } else if (step === 22 && state.place === "room") {
      renderSceneItems();
      setDialogue("...");
      continueButton.textContent = "Continue →";
    } else if (step === 23 && state.place === "room") {
      renderSceneItems();
      setDialogue("thank you! it was scary!!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 24 && state.place === "room") {
      renderSceneItems();
      setDialogue("Thank you for trusting me!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 25 && state.place === "room") {
      renderSceneItems();
      setDialogue("You must be Eve right? Your clothes fits you very well and I love your energy! Nice to meet you!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 26 && state.place === "room") {
      renderSceneItems();
      setDialogue("Right she looks so pretty!");
      continueButton.textContent = "Continue →";
    } else if (step === 27 && state.place === "room") {
      renderSceneItems();
      setDialogue("I have a little game for you, and at the end of it, you will get a surprise! Are you ready ?", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 28 && state.place === "room") {
      renderSceneItems();
      setDialogue("A game ?? A surprise ?? What do you mean ?? How can we be ready we don't understand what you're talking about you just went through my screen !!");
      continueButton.textContent = "Continue →";
    } else if (step === 29 && state.place === "room") {
      renderSceneItems();
      setDialogue("What do you think Eve ?");
      showChoices(
        [{ value: "game", label: "What's the game ?" }, { value: "surprise", label: "What's the surprise ?" }],
        state.conversationChoice,
        value => { state.conversationChoice = value; continueButton.disabled = false; }
      );
      continueButton.textContent = "Choose →";
      continueButton.disabled = !state.conversationChoice;
    } else if (step === 30 && state.place === "room") {
      renderSceneItems();
      setDialogue("Nothing difficult ! I will just ask you some questions and you have to answer", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 31 && state.place === "room") {
      renderSceneItems();
      setDialogue("This is a S-U-R-P-R-I-S-E ! I can't tell you a lot but I will bring you to somewhere special !", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 32 && state.place === "room") {
      renderSceneItems();
      setDialogue("Rules are very easy ! I will just ask you 5 questions, and you will have to answer. If I'm satisfied you will get the surprise ! Should we start now ?", "summoned");
      continueButton.textContent = "Start the game! →";
    } else if (step === 33 && state.place === "room") {
      renderSceneItems();
      setDialogue("Who is the best champion in League of Legends ?", "summoned");
      showChoices(
        [{ value: "ahri", label: "Ahri" }, { value: "akali", label: "Akali" }],
        state.quizAnswers.q1 || "",
        value => { state.quizAnswers.q1 = value; continueButton.disabled = false; }
      );
      continueButton.textContent = "Answer →";
      continueButton.disabled = !state.quizAnswers.q1;
    } else if (step === 34 && state.place === "room") {
      renderSceneItems();
      setDialogue("alright next question !", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 35 && state.place === "room") {
      renderSceneItems();
      setDialogue("What does Romain like more about Ahri ?", "summoned");
      showChoices(
        [{ value: "feet", label: "Her feet" }, { value: "gameplay", label: "Her gameplay" }],
        state.quizAnswers.q2 || "",
        value => { state.quizAnswers.q2 = value; continueButton.disabled = false; }
      );
      continueButton.textContent = "Answer →";
      continueButton.disabled = !state.quizAnswers.q2;
    } else if (step === 36 && state.place === "room") {
      renderSceneItems();
      setDialogue("Noted", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 37 && state.place === "room") {
      renderSceneItems();
      setDialogue("Who should be deleted from Genshin Impact ?", "summoned");
      showChoices(
        [{ value: "mavuika", label: "Mavuika" }, { value: "columbina", label: "Columbina" }],
        state.quizAnswers.q3 || "",
        value => { state.quizAnswers.q3 = value; continueButton.disabled = false; }
      );
      continueButton.textContent = "Answer →";
      continueButton.disabled = !state.quizAnswers.q3;
    } else if (step === 38 && state.place === "room") {
      renderSceneItems();
      setDialogue("agreed !", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 39 && state.place === "room") {
      renderSceneItems();
      setDialogue("Complete this quote : I am a", "summoned");
      showChoices(
        [{ value: "catgirl", label: "Catgirl" }],
        state.quizAnswers.q4 || "",
        value => { state.quizAnswers.q4 = value; continueButton.disabled = false; }
      );
      continueButton.textContent = "Answer →";
      continueButton.disabled = !state.quizAnswers.q4;
    } else if (step === 40 && state.place === "room") {
      renderSceneItems();
      setDialogue("I knew it !", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 41 && state.place === "room") {
      renderSceneItems();
      setDialogue("Who is the best person in the world :", "summoned");
      showChoices(
        [{ value: "me", label: "Me !" }, { value: "eve", label: "Eve" }],
        state.quizAnswers.q5 || "",
        value => { state.quizAnswers.q5 = value; continueButton.disabled = false; }
      );
      continueButton.textContent = "Answer →";
      continueButton.disabled = !state.quizAnswers.q5;
    } else if (step === 42 && state.place === "room") {
      renderSceneItems();
      setDialogue("YES!");
      continueButton.textContent = "Continue →";
    } else if (step === 43 && state.place === "room") {
      renderSceneItems();
      setDialogue("I like most of your answers, especially the two last one! Hehehehehe Well you deserve it ! I will bring you to that special place !", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 44 && state.place === "room") {
      renderSceneItems();
      setDialogue("Oh okay! Tell me when you're ready to go! You can still chill a bit here if you want to!");
      continueButton.textContent = "I'm ready to go →";
    } else if (step === 45) {
      renderFinalReunion();
      setDialogue("SURPRISE!", "eevee");
      continueButton.classList.remove("is-hidden");
      continueButton.textContent = "Continue ♡";
      backButton.classList.add("is-hidden");
      footerNote.textContent = "Eve’s bizarre adventures ♡";
    } else if (step === 200) {
      renderFinalReunion();
      setDialogue("Thank you for coming with and spending time with me, I had a lot of fun and you helped me to feel safe ! With everyone, we wanted to make you this surprise!");
      continueButton.classList.remove("is-hidden");
      continueButton.textContent = "Open the surprise ♡";
      backButton.classList.add("is-hidden");
      footerNote.textContent = "Eve’s bizarre adventures ♡";
    } else if (step === 201) {
      renderFinalReunion();
      renderFinalGifts();
      scene.classList.add("final-gifts-screen");
      setDialogue("");
      dialogueColumn.classList.add("is-hidden");
      continueButton.classList.add("is-hidden");
      backButton.classList.add("is-hidden");
      footerNote.textContent = "Eve’s bizarre adventures ♡";
    } else if (step === 60 && state.place === "beach") {
      setDialogue("Now that we're at the beach, I wanted to know, what do you like the more here?");
      showChoices([
        { value: "sunbathe", label: "Lay down and sunbathe in peace" },
        { value: "sandcastle", label: "Build some sandcastle" },
        { value: "swimming", label: "SWIMMING!!" }
      ], state.beachActivity, value => { state.beachActivity = value; continueButton.disabled = false; });
      continueButton.textContent = "Let's do it →";
      continueButton.disabled = !state.beachActivity;
    } else if (step === 61 && state.place === "beach") {
      setDialogue("That's fair! It's always the best time to do so. Maybe we can find a spot and start our stuff there!");
      continueButton.textContent = "Continue →";
    } else if (step === 62 && state.place === "beach") {
      setDialogue("What do you think about that place? Oh no ! I think I forgot the sunscreen..");
      continueButton.textContent = "Continue →";
    } else if (step === 63 && state.place === "beach") {
      setDialogue("Hey! I might be your savior!", "summoned");
      continueButton.textContent = "Who's there? →";
    } else if (step === 64 && state.place === "beach") {
      renderBeachCharacterForStep(step);
      setDialogue("Hihihihi! I'm Pompompurin! And I've got some sunscreen for you!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 65 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Thank you sir! Nice to meet you!"); continueButton.textContent = "Continue →";
    } else if (step === 66 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Nice to meet you too! I am always glad to help people!", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 67 && state.place === "beach") {
      renderBeachCharacterForStep(step); state.beachMeetChoice = ""; setDialogue("Thank you very much, Pompompurin!");
      showChoices([{ value: "thanks", label: "Thank you very much, Pompompurin!" }], state.beachMeetChoice, value => { state.beachMeetChoice = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachMeetChoice;
    } else if (step === 68 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("I think I've already seen you somewhere.. you must be Eve, the greatest Karaoke player of all time!!", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 69 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Wait, you're good at singing Eve?"); continueButton.textContent = "Continue →";
    } else if (step === 70 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("What would you say, Eve?");
      showChoices([{ value: "maybe", label: "Mhmm... at writing singing maybe yes.." }, { value: "yes", label: "Yes, I love singing!" }], state.beachSinging, value => { state.beachSinging = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachSinging;
    } else if (step === 71 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("That sounds so cool! There is a concert later, maybe you can come with me and my friends! You should actually meet them.", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 72 && state.place === "beach") {
      renderBeachCharacterForStep(step); state.beachMeetChoice = ""; setDialogue("What do you think about it, Eve?");
      showChoices([{ value: "meet", label: "Let's meet them, yes!" }], state.beachMeetChoice, value => { state.beachMeetChoice = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachMeetChoice;
    } else if (step === 73 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Okay, let's meet them !", "summoned"); continueButton.textContent = "Meet new friends →";
    } else if (step === 74 && state.place === "beach") {
      setDialogue("Nice to meet all of you! You all look so cute I'm meltinggg");
      renderStoryCharacter(null, true); state.beachFriendsRevealed = true; continueButton.textContent = "Continue →";
    } else if (step === 80 && state.place === "beach") {
      setDialogue("There is someone building a sandcastle out there !"); continueButton.textContent = "Go say hello →";
    } else if (step === 81 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Oh... Nice to meet you!", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 82 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Hellooo! What's your name?"); continueButton.textContent = "Continue →";
    } else if (step === 83 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("I-I am Pochacco ! I love building sandcastles..", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 84 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Can we help you with that ?"); continueButton.textContent = "Continue →";
    } else if (step === 85 && state.place === "beach") {
      renderBeachCharacterForStep(step); state.beachMeetChoice = ""; setDialogue("S-sure! I would love to make new friends. Would you like to become my friend ?", "summoned");
      showChoices([{ value: "friend", label: "Sure ! - Let's become friends !" }], state.beachMeetChoice, value => { state.beachMeetChoice = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachMeetChoice;
    } else if (step === 86 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Thank you so much, I'm so happy !", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 87 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("But wait, I think I've seen you somewhere.. are you that very well known Karaoke singer ?", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 88 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Wait, you're good at singing Eve?"); continueButton.textContent = "Continue →";
    } else if (step === 89 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("What would you say, Eve?");
      showChoices([{ value: "maybe", label: "Mhmm... at writing singing maybe yes.." }, { value: "yes", label: "Yes, I love singing!" }], state.beachSinging, value => { state.beachSinging = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachSinging;
    } else if (step === 90 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("That sounds so cool! There is a concert later, maybe you can come with me and my friends! You should actually meet them.", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 91 && state.place === "beach") {
      renderBeachCharacterForStep(step); state.beachMeetChoice = ""; setDialogue("What do you think about it, Eve?");
      showChoices([{ value: "meet", label: "Let's meet them, yes!" }], state.beachMeetChoice, value => { state.beachMeetChoice = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachMeetChoice;
    } else if (step === 92 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Okay, let's meet them !", "summoned"); continueButton.textContent = "Meet new friends →";
    } else if (step === 93 && state.place === "beach") {
      setDialogue("Nice to meet all of you! You all look so cute I'm meltinggg"); renderStoryCharacter(null, true); state.beachFriendsRevealed = true; continueButton.textContent = "Continue →";
    } else if (step === 100 && state.place === "beach") {
      setDialogue("We can try to get into water then!"); continueButton.textContent = "Continue →";
    } else if (step === 101 && state.place === "beach") {
      setDialogue("I am a bit scared to swim myself.. I never went into water alone !!"); continueButton.textContent = "Continue →";
    } else if (step === 102 && state.place === "beach") {
      setDialogue("it is kinda stressful, but I will do it, for you !"); continueButton.textContent = "Continue →";
    } else if (step === 103 && state.place === "beach") {
      setDialogue("Kero ?", "summoned"); continueButton.textContent = "Who said that? →";
    } else if (step === 104 && state.place === "beach") {
      setDialogue("Who made this noise ?!"); continueButton.textContent = "Continue →";
    } else if (step === 105 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Me, Kero!", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 106 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Hey what, there is a talking frog Eve!!"); continueButton.textContent = "Continue →";
    } else if (step === 107 && state.place === "beach") {
      renderBeachCharacterForStep(step); state.beachMeetChoice = ""; setDialogue("What do you think, Eve?");
      showChoices([{ value: "frog", label: "Wait you're right!!" }, { value: "pokemon", label: "You are a talking Pokemon as well Evee.." }], state.beachMeetChoice, value => { state.beachMeetChoice = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachMeetChoice;
    } else if (step === 108 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Hey, I hear you talking about me, Kero !", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 109 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Would you like to race against me, Kero ?", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 110 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("You're a frog, we have no chance.. may I ask you your name, by the way?"); continueButton.textContent = "Continue →";
    } else if (step === 111 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("I am Keroppi, Kero! And you are.. you are Eve I know you!!", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 112 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("How ? Are you famous Eve ?"); continueButton.textContent = "Continue →";
    } else if (step === 113 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("She sings so well, I know her !", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 114 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("What would you say, Eve?");
      showChoices([{ value: "maybe", label: "Mhmm... at writing singing maybe yes.." }, { value: "yes", label: "Yes, I love singing!" }], state.beachSinging, value => { state.beachSinging = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachSinging;
    } else if (step === 115 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("That sounds so cool! There is a concert later, maybe you can come with me and my friends! You should actually meet them, Kero", "summoned"); continueButton.textContent = "Continue →";
    } else if (step === 116 && state.place === "beach") {
      renderBeachCharacterForStep(step); state.beachMeetChoice = ""; setDialogue("What do you think about it, Eve?");
      showChoices([{ value: "meet", label: "Let's meet them, yes!" }], state.beachMeetChoice, value => { state.beachMeetChoice = value; continueButton.disabled = false; });
      continueButton.textContent = "Answer →"; continueButton.disabled = !state.beachMeetChoice;
    } else if (step === 117 && state.place === "beach") {
      renderBeachCharacterForStep(step); setDialogue("Okay, let's meet them, Kero!", "summoned"); continueButton.textContent = "Meet new friends →";
    } else if (step === 118 && state.place === "beach") {
      setDialogue("Nice to meet all of you! You all look so cute I'm meltinggg"); renderStoryCharacter(null, true); state.beachFriendsRevealed = true; continueButton.textContent = "Continue →";
    } else if (step === 120 && state.place === "beach") {
      renderStoryCharacter(null, true);
      setDialogue("You were all talking about concert right? When is it going to happen ?");
      continueButton.textContent = "Continue →";
    } else if (step === 121 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("PIKAAAA! The concert will start right nowww! Welcome... MEEEEEE!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 122 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Wow a Pikachu! A guitarist Pikachu!!");
      continueButton.textContent = "Continue →";
    } else if (step === 123 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("That's so cool! - I didn't know Pikachu knew how to play guitar..");
      continueButton.textContent = "Continue →";
    } else if (step === 124 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("YAYYY! I am going to make you amazing memories.. welcome to the Pikachu show!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 125 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Yayyy! That sounds very fun! Which songs are you gonna play on stage ?");
      continueButton.textContent = "Continue →";
    } else if (step === 126 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Hehehe... I will let you guys chose !", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 127 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Kerooo! I want you to sing Monster please!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 128 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Oh my god! Please sing Caraphernelia from Pierce the Veil, I beg you!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 129 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Oh.. that would be nice if you could sing a Persona song!", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 130 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Hey, I cannot sing every single songs! Evee and Eve, you haven't suggested any song as well, what do you think ?", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 131 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("I don't really know.. but Eve is an amazing singer, maybe she can chose and even sing with you ?");
      continueButton.textContent = "Continue →";
    } else if (step === 132 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Yes I love that Idea! Eve, pick a music between the one proposed, and sing on stage with me!", "summoned");
      showChoices([
        { value: "monster", label: "Monster" },
        { value: "caraphernelia", label: "Caraphernelia" },
        { value: "no-more-what-ifs", label: "No More What Ifs" }
      ], state.beachSong, value => { state.beachSong = value; continueButton.disabled = false; });
      continueButton.textContent = "Choose song →";
      continueButton.disabled = !state.beachSong;
    } else if (step === 133 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("Good, tell me when you are ready !");
      continueButton.textContent = "Ready!";
    } else if (step === 134 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      state.beachSong = "";
      setDialogue("That was insane ! Thank you for singing with me, I love your voice so much ! Would you like to go for another round ?", "summoned");
      showChoices([
        { value: "monster", label: "Monster" },
        { value: "caraphernelia", label: "Caraphernelia" },
        { value: "no-more-what-ifs", label: "No More What Ifs" },
        { value: "no-thanks", label: "No, thank you !" }
      ], state.beachSong, value => { state.beachSong = value; continueButton.disabled = false; });
      continueButton.textContent = "Choose →";
      continueButton.disabled = !state.beachSong;
    } else if (step === 135 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("I loved seeing you on stage, you are very brave to sing in front of such a crowd");
      continueButton.textContent = "Continue →";
    } else if (step === 136 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("She really is! Since you've performed with me, I would like to bring you somewhere later, would you like to join ?", "summoned");
      continueButton.textContent = "Continue →";
    } else if (step === 137 && state.place === "beach") {
      renderStoryCharacter(null, true); renderPikachu();
      setDialogue("I think that's a great idea! Tell me when you're ready Eve !");
      continueButton.textContent = "I'm ready to go →";
    } else {
      renderFriends();
      if (step === 13 && state.place === "room") renderSceneItems();
      const named = Object.entries(state.names).filter(([, name]) => name);
      const ending = named.length
        ? `Those are lovely names: ${named.map(([, name]) => name).join(" and ")}. They're lucky to spend this moment with you. ♡`
        : "I hope this little place gives you a moment of peace. Thank you for coming on this tiny trip with me. ♡";
      setDialogue(ending);
      continueButton.textContent = "Start again ↻";
      footerNote.textContent = "you deserve little moments of peace ♡";
    }
  }

  startButton.addEventListener("click", () => {
    welcomeScreen.classList.add("is-hidden");
    storyScreen.classList.remove("is-hidden");
    restartStoryButton.classList.remove("is-hidden");
    footerNote.textContent = "take your time ♡";
    goToStep(0);
  });

  continueButton.addEventListener("click", () => {
    if (state.step === 45) {
      goToStep(200);
    } else if (state.step === 200) {
      goToStep(201);
    } else if (state.step === 0) {
      goToStep(1);
    } else if (state.step === 1) {
      if (!state.place) return;
      goToStep(2);
    } else if (state.step === 2) {
      updateBackground(state.place);
      goToStep(3);
    } else if (state.step === 3) {
      if (!state.friends.length) return;
      goToStep(4);
    } else if (state.step === 4) {
      goToStep(state.naming ? 5 : (state.place === "beach" ? 60 : 6));
    } else if (state.step === 5) {
      nameEntry.querySelectorAll("input").forEach(input => {
        const animal = input.id.replace("name-", "");
        state.names[animal] = input.value.trim();
      });
      goToStep(state.place === "beach" ? 60 : 6);
    } else if (state.step >= 6 && state.step <= 12 && state.place === "lake") {
      goToStep(state.step + 1);
    } else if (state.step === 13 && state.place === "lake") {
      // The lake/mansion invitation stores its answer in reunionChoice.
      // Checking conversationChoice here left the Answer button unable to advance.
      if (!state.reunionChoice) return;
      goToStep(14);
    } else if (state.step === 14 && state.place === "lake") {
      goToStep(15);
    } else if (state.step === 15 && state.place === "lake") {
      goToStep(16);
    } else if (state.step >= 16 && state.step <= 19 && state.place === "lake") { goToStep(state.step+1);
    } else if (state.step === 20 && state.place === "lake") { if(!state.mansionPath)return; goToStep(21);
    } else if (state.step === 21 && state.place === "lake") { goToStep(state.mansionPath === "hanako" ? 30 : 36);
    } else if (state.step >= 30 && state.step < 35 && state.place === "lake") { goToStep(state.step+1);
    } else if (state.step === 35 && state.place === "lake") { state.hideRounds=0; state.hideChoice=""; state.hideCaught=false; state.mansionGameComplete=false; goToStep(22);
    } else if (state.step >= 36 && state.step < 42 && state.place === "lake") { goToStep(state.step+1);
    } else if (state.step === 42 && state.place === "lake") { state.boxChoice=""; state.mansionGameComplete=false; goToStep(23);
    } else if (state.step === 22 && state.place === "lake") { if(!state.hideChoice && state.mansionPath==="hanako")return; goToStep(23);
    } else if (state.step === 23 && state.place === "lake") { if(state.mansionPath==="hutao"&&!state.boxChoice)return; goToStep(24);
    } else if (state.step === 24 && state.place === "lake") {
      if (state.mansionPath === "hanako") {
        if (!state.mansionGameComplete) { if (state.hideRounds < 3 && !state.hideCaught) goToStep(22); else goToStep(24); }
        else if (state.mansionGamesPlayed.includes("hutao")) { goToStep(43); }
        else {
          if (!state.mansionAfterPath) return;
          if (state.mansionAfterPath === "wait") { state.mansionAfterPath=""; return; }
          state.mansionPath="hutao"; state.mansionAfterPath=""; state.boxChoice=""; state.mansionGameComplete=false; goToStep(21);
        }
      } else {
        if (!state.mansionGamesPlayed.includes("hutao")) state.mansionGamesPlayed.push("hutao");
        if (state.mansionGamesPlayed.includes("hanako")) { goToStep(43); }
        else {
          if (!state.mansionAfterPath) return;
          if (state.mansionAfterPath === "wait") { state.mansionAfterPath=""; return; }
          state.mansionPath="hanako"; state.mansionAfterPath=""; state.hideRounds=0; state.hideChoice=""; state.hideCaught=false; state.mansionGameComplete=false; goToStep(21);
        }
      }
    } else if (state.step === 25 && state.place === "lake") { goToStep(43);
    } else if (state.step >= 43 && state.step < 47 && state.place === "lake") { goToStep(state.step + 1);
    } else if (state.step === 47 && state.place === "lake") { if (!state.reunionChoice) return; goToStep(48);
    } else if (state.step === 48 && state.place === "lake") { goToStep(49);
    } else if (state.step === 49 && state.place === "lake") { goToStep(50);
    } else if (state.step === 26 && state.place === "lake") { goToStep(27);
    } else if (state.step === 27 && state.place === "lake") { goToStep(28);
    } else if (state.step === 6 && state.place === "room") {
      if (!state.drink) return;
      goToStep(7);
    } else if (state.step === 7 && state.place === "room") {
      if (!state.food) return;
      goToStep(8);
    } else if (state.step === 8 && state.place === "room") {
      goToStep(9);
    } else if (state.step === 9 && state.place === "room") {
      goToStep(10);
    } else if (state.step === 10 && state.place === "room") {
      goToStep(11);
    } else if (state.step === 11 && state.place === "room") {
      goToStep(12);
    } else if (state.step === 12 && state.place === "room") {
      goToStep(13);
    } else if (state.step === 13 && state.place === "room") {
      goToStep(14);
    } else if (state.step === 15 && state.place === "room") {
      goToStep(16);
    } else if (state.step === 16 && state.place === "room") {
      goToStep(17);
    } else if (state.step === 17 && state.place === "room") {
      goToStep(18);
    } else if (state.step === 18 && state.place === "room") {
      if (!state.gameChoice) return;
      goToStep(state.gameChoice === "attack" ? 19 : 24);
    } else if (state.step === 19 && state.place === "room") {
      goToStep(20);
    } else if (state.step === 20 && state.place === "room") {
      goToStep(21);
    } else if (state.step === 21 && state.place === "room") {
      goToStep(22);
    } else if (state.step === 22 && state.place === "room") {
      goToStep(23);
    } else if (state.step === 23 && state.place === "room") {
      goToStep(25);
    } else if (state.step === 24 && state.place === "room") {
      goToStep(25);
    } else if (state.step === 25 && state.place === "room") {
      goToStep(26);
    } else if (state.step === 26 && state.place === "room") {
      goToStep(27);
    } else if (state.step === 27 && state.place === "room") {
      goToStep(28);
    } else if (state.step === 28 && state.place === "room") {
      goToStep(29);
    } else if (state.step === 29 && state.place === "room") {
      if (!state.conversationChoice) return;
      goToStep(state.conversationChoice === "game" ? 30 : 31);
    } else if ((state.step === 30 || state.step === 31) && state.place === "room") {
      goToStep(32);
    } else if (state.step === 32 && state.place === "room") {
      goToStep(33);
    } else if (state.step === 33 && state.place === "room") {
      if (!state.quizAnswers.q1) return;
      goToStep(34);
    } else if (state.step === 34 && state.place === "room") {
      goToStep(35);
    } else if (state.step === 35 && state.place === "room") {
      if (!state.quizAnswers.q2) return;
      goToStep(36);
    } else if (state.step === 36 && state.place === "room") {
      goToStep(37);
    } else if (state.step === 37 && state.place === "room") {
      if (!state.quizAnswers.q3) return;
      goToStep(38);
    } else if (state.step === 38 && state.place === "room") {
      goToStep(39);
    } else if (state.step === 39 && state.place === "room") {
      if (!state.quizAnswers.q4) return;
      goToStep(40);
    } else if (state.step === 40 && state.place === "room") {
      goToStep(41);
    } else if (state.step === 41 && state.place === "room") {
      if (!state.quizAnswers.q5) return;
      goToStep(42);
    } else if (state.step === 42 && state.place === "room") {
      goToStep(43);
    } else if (state.step === 43 && state.place === "room") {
      goToStep(44);
    } else if (state.step === 44 && state.place === "room") {
      goToStep(45);
    } else if (state.step === 60 && state.place === "beach") {
      if (!state.beachActivity) return;
      goToStep(state.beachActivity === "sunbathe" ? 61 : state.beachActivity === "sandcastle" ? 80 : 100);
    } else if (state.step === 61 && state.place === "beach") goToStep(62);
    else if (state.step === 62 && state.place === "beach") goToStep(63);
    else if (state.step === 63 && state.place === "beach") goToStep(64);
    else if (state.step === 64 && state.place === "beach") goToStep(65);
    else if (state.step === 65 && state.place === "beach") goToStep(66);
    else if (state.step === 66 && state.place === "beach") goToStep(67);
    else if (state.step === 67 && state.place === "beach") { if (!state.beachMeetChoice) return; goToStep(68); }
    else if (state.step === 68 && state.place === "beach") goToStep(69);
    else if (state.step === 69 && state.place === "beach") goToStep(70);
    else if (state.step === 70 && state.place === "beach") { if (!state.beachSinging) return; goToStep(71); }
    else if (state.step === 71 && state.place === "beach") goToStep(72);
    else if (state.step === 72 && state.place === "beach") { if (!state.beachMeetChoice) return; goToStep(73); }
    else if (state.step === 73 && state.place === "beach") goToStep(74);
    else if (state.step === 74 && state.place === "beach") goToStep(120);
    else if (state.step === 80 && state.place === "beach") goToStep(81);
    else if (state.step === 81 && state.place === "beach") goToStep(82);
    else if (state.step === 82 && state.place === "beach") goToStep(83);
    else if (state.step === 83 && state.place === "beach") goToStep(84);
    else if (state.step === 84 && state.place === "beach") goToStep(85);
    else if (state.step === 85 && state.place === "beach") { if (!state.beachMeetChoice) return; goToStep(86); }
    else if (state.step === 86 && state.place === "beach") goToStep(87);
    else if (state.step === 87 && state.place === "beach") goToStep(88);
    else if (state.step === 88 && state.place === "beach") goToStep(89);
    else if (state.step === 89 && state.place === "beach") { if (!state.beachSinging) return; goToStep(90); }
    else if (state.step === 90 && state.place === "beach") goToStep(91);
    else if (state.step === 91 && state.place === "beach") { if (!state.beachMeetChoice) return; goToStep(92); }
    else if (state.step === 92 && state.place === "beach") goToStep(93);
    else if (state.step === 93 && state.place === "beach") goToStep(120);
    else if (state.step === 100 && state.place === "beach") goToStep(101);
    else if (state.step === 101 && state.place === "beach") goToStep(102);
    else if (state.step === 102 && state.place === "beach") goToStep(103);
    else if (state.step === 103 && state.place === "beach") goToStep(104);
    else if (state.step === 104 && state.place === "beach") goToStep(105);
    else if (state.step === 105 && state.place === "beach") goToStep(106);
    else if (state.step === 106 && state.place === "beach") goToStep(107);
    else if (state.step === 107 && state.place === "beach") { if (!state.beachMeetChoice) return; goToStep(108); }
    else if (state.step === 108 && state.place === "beach") goToStep(109);
    else if (state.step === 109 && state.place === "beach") goToStep(110);
    else if (state.step === 110 && state.place === "beach") goToStep(111);
    else if (state.step === 111 && state.place === "beach") goToStep(112);
    else if (state.step === 112 && state.place === "beach") goToStep(113);
    else if (state.step === 113 && state.place === "beach") goToStep(114);
    else if (state.step === 114 && state.place === "beach") { if (!state.beachSinging) return; goToStep(115); }
    else if (state.step === 115 && state.place === "beach") goToStep(116);
    else if (state.step === 116 && state.place === "beach") { if (!state.beachMeetChoice) return; goToStep(117); }
    else if (state.step === 117 && state.place === "beach") goToStep(118);
    else if (state.step === 118 && state.place === "beach") goToStep(120);
    else if (state.step >= 120 && state.step <= 131 && state.place === "beach") goToStep(state.step + 1);
    else if (state.step === 132 && state.place === "beach") {
      if (!state.beachSong) return;
      goToStep(133);
    } else if (state.step === 133 && state.place === "beach") {
      openKaraoke();
    } else if (state.step === 134 && state.place === "beach") {
      if (!state.beachSong) return;
      if (state.beachSong === "no-thanks") goToStep(135);
      else goToStep(133);
    } else if (state.step === 135 && state.place === "beach") goToStep(136);
    else if (state.step === 136 && state.place === "beach") goToStep(137);
    else if (state.step === 137 && state.place === "beach") goToStep(45);
    else {
      state.step = 0;
      state.place = "";
      state.friends = [];
      state.naming = false;
      state.names = {};
      state.drink = "";
      state.food = "";
      state.invoked = "";
      state.gameChoice = "";
      state.conversationChoice = "";
      state.quizAnswers = {};
      state.beachActivity = "";
      state.beachSinging = "";
      state.beachSong = "";
      state.beachMeetChoice = "";
      state.beachFriendsRevealed = false;
      state.gameStage = 0;
      playGameButton.classList.add("is-hidden");
      continueButton.classList.remove("is-hidden");
      state.friendCoordinates = {};
      state.sceneItemCoordinates = {};
      updateBackground("");
      footerNote.textContent = "made with a little bit of love ♡";
      storyScreen.classList.add("is-hidden");
      welcomeScreen.classList.remove("is-hidden");
      sceneFriends.replaceChildren();
      sceneItems.replaceChildren();
      setDialogueClosed(false);
    }
  });

  const summonCharacters = [
    { id: "paimon", name: "Paimon", src: "assets/paimon.png" },
    { id: "nene", name: "Nene Yashiro", src: "assets/nene.png" },
    { id: "madoka", name: "Madoka Kaname", src: "assets/madoka.png" }
  ];

  function openGame() {
    gameOverlay.classList.remove("is-hidden");
    summonPreview.classList.add("is-hidden");
    gameIntro.textContent = "Take a deep breath, make a little wish, and see who joins your adventure.";
    gambleButton.disabled = false;
    gambleButton.textContent = "Gambling time!";
  }

  function closeGame() {
    gameOverlay.classList.add("is-hidden");
  }

  playGameButton.addEventListener("click", openGame);
  gameClose.addEventListener("click", closeGame);
  gameOverlay.addEventListener("click", event => {
    if (event.target === gameOverlay) closeGame();
  });

  gambleButton.addEventListener("click", () => {
    const pick = summonCharacters[Math.floor(Math.random() * summonCharacters.length)];
    state.invoked = pick.id;
    state.gameChoice = "";
    summonPreviewImage.src = pick.src;
    summonPreviewImage.alt = pick.name;
    summonPreviewName.textContent = `${pick.name} has joined your adventure!`;
    summonPreview.classList.remove("is-hidden");
    gameIntro.textContent = "Someone is joining your adventure!";
    gambleButton.disabled = true;
    gambleButton.textContent = "Summoned!";
    window.setTimeout(() => {
      closeGame();
      playGameButton.classList.add("is-hidden");
      continueButton.classList.remove("is-hidden");
      goToStep(15);
    }, 1100);
  });

  restartStoryButton.addEventListener("click", () => {
    letterOverlay.classList.add("is-hidden");
    gameOverlay.classList.add("is-hidden");
    karaokeOverlay.classList.add("is-hidden");
    if (karaokeAudio) { karaokeAudio.pause(); karaokeAudio.currentTime = 0; }
    Object.assign(state, {
      step: 0, place: "", friends: [], naming: false, names: {}, dialogueClosed: false,
      friendCoordinates: {}, drink: "", food: "", sceneItemCoordinates: {}, invoked: "",
      gameChoice: "", conversationChoice: "", quizAnswers: {}, beachActivity: "",
      beachSinging: "", beachMeetChoice: "", beachFriendsRevealed: false,
      beachCharacterCoordinates: {}, beachSong: "", gameStage: 0, mansionPath: "",
      mansionFirstPath: "", mansionGamesPlayed: [], hideChoice: "", hideRounds: 0,
      chicaChoice: "", hideCaught: false, mansionGameComplete: false, boxChoice: "",
      mansionAfterPath: "", reunionChoice: ""
    });
    updateBackground("");
    sceneFriends.replaceChildren();
    sceneItems.replaceChildren();
    storyScreen.classList.add("is-hidden");
    welcomeScreen.classList.remove("is-hidden");
    restartStoryButton.classList.add("is-hidden");
    footerNote.textContent = "made with a little bit of love ♡";
    continueButton.textContent = "Continue →";
    goToStep(0);
  });

  letterClose.addEventListener("click", () => letterOverlay.classList.add("is-hidden"));
  letterOverlay.addEventListener("click", event => {
    if (event.target === letterOverlay) letterOverlay.classList.add("is-hidden");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") letterOverlay.classList.add("is-hidden");
  });

  backButton.addEventListener("click", () => {
    if (state.step === 25) goToStep(state.gameChoice === "attack" ? 23 : 24);
    else if (state.step === 24) goToStep(18);
    else if (state.step === 30 || state.step === 31) goToStep(29);
    else if (state.step === 32) goToStep(state.conversationChoice === "game" ? 30 : 31);
    else if (state.step === 45) goToStep(44);
    else if (state.step >= 60 && state.step <= 118) {
      if ([61, 80, 100].includes(state.step)) goToStep(60);
      else if (state.step === 60) goToStep(5);
      else goToStep(state.step - 1);
    }
    else if (state.step > 0) goToStep(state.step - 1);
  });

  eeveeToggle.addEventListener("click", () => {
    setDialogueClosed(!state.dialogueClosed);
  });

  eeveeGuide.addEventListener("error", () => {
    eeveeGuide.alt = "Eevee image could not be loaded";
    console.error("The Eevee sprite could not be loaded. Check assets/eevee-portrait.jpeg.");
  });
})();
