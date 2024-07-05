const wordInput = document.querySelector("[data-word-input]");
const confirmBtn = document.querySelector("[data-confirm-btn]");
const textElement = document.querySelector("[data-word-text]");
const wordMeaning = document.querySelector("[data-meaning]");
const wordPhonetic = document.querySelector("[data-phonetic]");
const audioElement = document.querySelector("[data-audio]");
const otherMeaningBtn = document.querySelector("[data-other-meaning-btn]");
let meanings = [];
let phonetic;
let audio;
let text;
let clickIndex = 0;

const getAudio = (data) => {
  for (let e of data) {
    if (e.audio !== "") {
      return e.audio;
    }
  }
  return null;
};

const searchWord = async (word) => {
  const response = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
  );
  if (!response.ok) {
    alert("This word does not exist in English dictionary.")
    throw new Error("Error With Fetcing Data.");
  }

  try {
    const data = await response.json();
    data[0].meanings[0].definitions.forEach((e) => {
      meanings.push(e.definition);
    });
    phonetic = data[0].phonetic;
    audio = getAudio(data[0].phonetics);
    text = data[0].word;
  } catch (error) {
    console.log("Chyba při získávání dat " + error);
  }
};

confirmBtn.addEventListener("click", async () => {
  meanings = [];
  clickIndex = 0;
  const word = wordInput.value;
  await searchWord(word);

  textElement.textContent = text;
  wordMeaning.textContent = meanings[0];
  wordPhonetic.textContent = phonetic;
  otherMeaningBtn.textContent = "other meaning";
  otherMeaningBtn.style.display = "block";
  audioElement.src = audio;

  audioElement.load();
  audioElement.play().catch(error => {
    console.log("Audio play prevented: " + error);
  });

  otherMeaningBtn.addEventListener("click", () => {
    clickIndex === meanings.length - 1 ? (clickIndex = 0) : clickIndex++;
    wordMeaning.textContent = meanings[clickIndex];
  });
});
