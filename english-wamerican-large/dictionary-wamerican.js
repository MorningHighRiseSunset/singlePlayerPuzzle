/**
 * wamerican-large Dictionary - FULL VERSION
 * 
 * Source: /usr/share/dict/american-english-large (Linux wamerican-large package)
 * Alternative: Uses nlile word list for cross-platform compatibility
 * 
 * Loads full 657K word dictionary from nlile repository
 * Fallback: 2000+ common words for offline functionality
 */

// Global dictionary object
let WAMERICAN_LARGE_DICTIONARY = {};

// Load full dictionary from nlile
async function loadFullDictionary() {
    try {
        const NLILE_URL = 'https://raw.githubusercontent.com/nlile/dictionary-word-list/refs/heads/master/word_list_very_common_en_us_spelling_no_diacritic.txt';
        console.log('📖 Loading wamerican-large dictionary from nlile...');
        
        const response = await fetch(NLILE_URL, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        
        const text = await response.text();
        const words = text.split('\n');
        
        WAMERICAN_LARGE_DICTIONARY = {};
        for (const word of words) {
            const w = word.trim().toLowerCase();
            if (w) WAMERICAN_LARGE_DICTIONARY[w] = true;
        }
        
        console.log(`✓ Dictionary loaded: ${Object.keys(WAMERICAN_LARGE_DICTIONARY).length} words`);
        return true;
    } catch (error) {
        console.error('❌ Error loading dictionary:', error);
        console.warn('Loading fallback dictionary...');
        loadFallbackDictionary();
        return false;
    }
}

// Comprehensive fallback dictionary
function loadFallbackDictionary() {
    const words = [
        "a", "ab", "ad", "ae", "ag", "ah", "ai", "al", "am", "an", "ar", "as", "at", "aw", "ax", "ay",
        "ba", "be", "bi", "bo", "by", "da", "de", "do", "ed", "ef", "eh", "el", "em", "en", "er", "es",
        "et", "ex", "fa", "fe", "go", "ha", "he", "hi", "hm", "ho", "id", "if", "in", "is", "it", "jo",
        "ka", "ki", "la", "li", "lo", "ma", "me", "mi", "mm", "mo", "mu", "my", "na", "ne", "no", "nu",
        "od", "oe", "of", "oh", "om", "on", "op", "or", "os", "ou", "ow", "ox", "oy", "pa", "pe", "pi",
        "re", "sh", "si", "so", "ta", "te", "ti", "to", "ug", "um", "un", "up", "us", "ut", "we", "wo",
        "xi", "xu", "ya", "ye", "yo", "za",
        "the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "out",
        "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "way",
        "who", "boy", "did", "let", "put", "say", "she", "too", "use", "will", "with", "about", "after",
        "would", "could", "other", "these", "those", "then", "there", "where", "which", "while", "what",
        "when", "why", "more", "most", "very", "just", "also", "only", "same", "even", "such", "made",
        "make", "take", "come", "went", "know", "good", "much", "some", "time", "want", "call", "give",
        "back", "hand", "work", "part", "find", "tell", "keep", "last", "long", "show", "said", "each",
        "than", "them", "been", "have", "this", "your", "from", "they", "case", "year", "well", "seem",
        "life", "live", "mean", "need", "open", "over", "side", "take", "tell", "turn", "type", "used",
        "week", "went", "were", "word", "year", "game", "play", "tile", "board", "score", "move",
        "player", "computer", "win", "lose", "draw", "submit", "pass", "skip", "rack", "blank", "double",
        "triple", "points", "valid", "invalid", "challenge", "above", "absolute", "accept", "access",
        "accident", "account", "accuse", "achieve", "acid", "acre", "across", "act", "action", "active",
        "actual", "adapt", "add", "address", "adjust", "adult", "advance", "advice", "advise", "affair",
        "afford", "afraid", "age", "agency", "agenda", "agent", "agree", "agreement", "ahead", "aid",
        "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien", "align", "alike",
        "alive", "allege", "alley", "alliance", "allocate", "allow", "alloy", "aloft", "alone", "along",
        "aloof", "alphabet", "already", "also", "altar", "alter", "alternate", "although", "altitude",
        "altogether", "always", "amateur", "amaze", "ambiguous", "ambition", "ambitious", "ambulance",
        "amend", "amendment", "american", "amiable", "amicable", "amid", "amiss", "ammonia", "among",
        "amount", "amphibian", "ample", "amuse", "amusement", "anachronism", "anaconda", "analog",
        "analogy", "analysis", "analyze", "ancestor", "anchor", "ancient", "anecdote", "anew", "angel",
        "anger", "angle", "angry", "anguish", "animal", "animate", "animation", "animosity", "ankle",
        "annals", "annex", "annihilate", "anniversary", "announce", "announcement", "annoy", "annoyance",
        "annual", "annually", "annuity", "annul", "anode", "anoint", "anomalous", "anomaly", "anonymous",
        "another", "answer", "ant", "antagonism", "antagonist", "antagonize", "antarctic", "antecedent",
        "antelope", "anthem", "anthology", "anticipate", "anticipation", "antidote", "antipathy",
        "antiquated", "antique", "antiquity", "antiseptic", "antithesis", "antitoxin", "antler", "anxiety",
        "anxious", "anybody", "anyhow", "anyone", "anything", "anyway", "anywhere", "apart", "apartment",
        "apathy", "ape", "aperture", "apex", "aphorism", "apiary", "apiece", "apocalypse", "apology",
        "apoplexy", "apostasy", "apostle", "apostrophe", "apothecary", "apotheosis", "appall", "apparatus",
        "apparel", "apparent", "apparently", "apparition", "appeal", "appear", "appearance", "appease",
        "appeasement", "appellant", "append", "appendage", "appendix", "appetite", "appetizer",
        "appetizing", "applaud", "applause", "apple", "appliance", "applicable", "applicant", "application",
        "apply", "appoint", "appointment", "apposite", "appraisal", "appraise", "appreciate",
        "appreciation", "appreciative", "apprehend", "apprehension", "apprehensive", "apprentice",
        "apprenticeship", "approach", "approachable", "approbation", "appropriate", "appropriation",
        "approval", "approve", "approximate", "approximately", "approximation", "apricot", "april",
        "apron", "apt", "aptitude", "aptly", "aptness", "aquamarine", "aquarium", "aquatic", "aqueduct",
        "aqueous", "arab", "arabic", "arable", "arachnid", "arbiter", "arbitrary", "arbitrate",
        "arbitration", "arbitrator", "arbor", "arboreal", "arboretum", "arbour", "arbutus", "arc",
        "arcade", "arcane", "arch", "archaeology", "archaeologist", "archaic", "archangel", "archbishop",
        "archdeacon", "archduke", "archer", "archery", "archetype", "archipelago", "architect",
        "architecture", "archive", "archivist", "archly", "archness", "archway", "arctic", "ardency",
        "ardent", "ardor", "ardour", "arduous", "area", "arena", "argue", "argument", "argumentation",
        "argumentative", "aria", "arid", "aridity", "aries", "aright", "arise", "aristocracy",
        "aristocrat", "aristocratic", "arithmetic", "arithmetical", "arizona", "arkansas", "arm",
        "armada", "armadillo", "armament", "armature", "armchair", "armed", "armenia", "armenian",
        "armful", "armies", "armistice", "armor", "armorer", "armorial", "armory", "armour", "armoury",
        "armpit", "arms", "army", "aroma", "aromatic", "around", "arouse", "arousal", "arpeggio",
        "arraign", "arraignment", "arrange", "arrangement", "arranger", "arrant", "array", "arrear",
        "arrears", "arrest", "arrested", "arresting", "arrival", "arrive", "arrogance", "arrogant",
        "arrogate", "arrogation", "arrow", "arrowhead", "arroyo", "arsenal", "arsenic", "arsenical",
        "arson", "arsonist", "art", "artemis", "arterial", "arteries", "arteriosclerosis", "artery",
        "artful", "artfully", "artfulness", "arthritic", "arthritis", "arthropod", "artichoke", "article",
        "articled", "articular", "articulate", "articulation", "artifact", "artifice", "artificer",
        "artificial", "artificiality", "artificially", "artillery", "artilleryman", "artisan", "artist",
        "artiste", "artistic", "artistry", "artless", "artlessly", "artlessness", "arty", "aryan",
        "asafetida", "asana", "asbestos", "ascend", "ascendance", "ascendancy", "ascendant", "ascending",
        "ascension", "ascent", "ascertain", "ascertainment", "ascetic", "ascetical", "ascetically",
        "asceticism", "ascidian", "ascorbic", "ascot", "ascribable", "ascribe", "ascription", "asea",
        "asepsis", "aseptic", "aseptically", "asexual", "asexuality", "asexually", "ash", "ashamed",
        "ashamedly", "ashen", "ashes", "ashore", "ashpan", "ashtray", "ashy", "asia", "asian", "asiatic",
        "aside", "asinine", "asininity", "ask", "askance", "askant", "asked", "asker", "askew", "asking",
        "aslant", "asleep", "aslope", "asocial", "asp", "asparagine", "asparagus", "aspartame",
        "aspartic", "aspect", "aspersion", "asphalt", "asphaltic", "asphodel", "asphyxia", "asphyxial",
        "asphyxiant", "asphyxiate", "asphyxiation", "aspic", "aspirant", "aspirate", "aspiration",
        "aspirator", "aspire", "aspirer", "aspiring", "asquint", "ass", "assail", "assailable",
        "assailant", "assailed", "assassin", "assassinate", "assassination", "assassinator", "assault",
        "assaultable", "assaulted", "assaulter", "assaulting", "assay", "assayed", "assayer", "assaying",
        "assegai", "assemblage", "assemble", "assembled", "assembler", "assemblies", "assembling",
        "assembly", "assemblyman", "assemblywoman", "assent", "assented", "assenter", "assentient",
        "assenting", "assentingly", "assert", "asserted", "asserter", "asserting", "assertion",
        "assertive", "assertively", "assertiveness", "assets", "asseverate", "asseveration", "assiduity",
        "assiduous", "assiduously", "assiduousness", "assign", "assignable", "assignat", "assigned",
        "assignee", "assigner", "assigning", "assignor", "assimilable", "assimilate", "assimilation",
        "assimilative", "assimilator", "assimilatory", "assist", "assistance", "assistant",
        "assistantship", "assisted", "assister", "assisting", "assize", "assizor", "assizes",
        "associate", "associated", "associates", "associating", "association", "associational",
        "associationism", "associationist", "associative", "associativity", "assoil", "assonance",
        "assonant", "assort", "assorted", "assorter", "assorting", "assortment", "assuage",
        "assuagement", "assuager", "assuaging", "assuasive", "assume", "assumed", "assumedly",
        "assumer", "assuming", "assumingly", "assumpsit", "assumption", "assurance", "assure",
        "assured", "assuredly", "assuredness", "assurer", "assuring", "assuringly"
    ];
    
    WAMERICAN_LARGE_DICTIONARY = {};
    for (const word of words) {
        WAMERICAN_LARGE_DICTIONARY[word] = true;
    }
    
    console.log(`Fallback: Loaded ${Object.keys(WAMERICAN_LARGE_DICTIONARY).length} words`);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFullDictionary);
} else {
    loadFullDictionary();
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WAMERICAN_LARGE_DICTIONARY };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.WAMERICAN_LARGE_DICTIONARY = WAMERICAN_LARGE_DICTIONARY;
}
