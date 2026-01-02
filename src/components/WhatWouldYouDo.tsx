import { useState } from 'react';
import { ArrowLeft, Star, Home, RotateCcw, Volume2, MessageSquare, Check } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useTranslation } from '../utils/translations';

interface WhatWouldYouDoProps {
  onBack: () => void;
}

type GameState = 'setup' | 'playing' | 'feedback' | 'complete';

interface Choice {
  id: string;
  action: Record<Language, string>;
  isCorrect: boolean;
  icon: string;
}

interface Scenario {
  id: number;
  emoji: string;
  situation: Record<Language, string>;
  context: Record<Language, string>;
  choices: Choice[];
  explanation: Record<Language, string>;
  category: 'boundaries' | 'assertiveness' | 'game-rules' | 'stranger-safety' | 'asking-permission';
}

const scenarioPool: Scenario[] = [
  // Boundaries - Unwanted Hug
  {
    id: 1,
    emoji: '🤗',
    situation: {
      en: 'You don\'t want a hug from Auntie',
      ms: 'Anda tidak mahu pelukan daripada Mak Cik',
      zh: '你不想让阿姨抱抱'
    },
    context: {
      en: 'Your aunt wants to give you a hug, but you don\'t feel like hugging right now.',
      ms: 'Mak cik anda ingin memberi anda pelukan, tetapi anda tidak mahu dipeluk sekarang.',
      zh: '你的阿姨想给你一个拥抱，但你现在不想被抱。'
    },
    category: 'boundaries',
    choices: [
      {
        id: 'scream',
        action: {
          en: 'Scream and hit',
          ms: 'Menjerit dan pukul',
          zh: '尖叫并打人'
        },
        isCorrect: false,
        icon: '😡'
      },
      {
        id: 'alternative',
        action: {
          en: 'Say "No thank you, I want a high-five"',
          ms: 'Katakan "Tidak terima kasih, saya mahu high-five"',
          zh: '说"不用了谢谢，我想要击掌"'
        },
        isCorrect: true,
        icon: '✋'
      }
    ],
    explanation: {
      en: 'It\'s okay to say no to hugs! Offering another greeting like a high-five or wave is polite and respectful.',
      ms: 'Tidak mengapa untuk menolak pelukan! Menawarkan salam lain seperti high-five atau lambaian adalah sopan dan hormat.',
      zh: '拒绝拥抱是可以的！提供其他问候方式如击掌或挥手是礼貌和尊重的。'
    }
  },

  // Assertiveness - Toy Taking
  {
    id: 2,
    emoji: '🧸',
    situation: {
      en: 'A friend grabs your toy',
      ms: 'Seorang kawan merebut mainan anda',
      zh: '朋友抢走了你的玩具'
    },
    context: {
      en: 'Your friend took your toy without asking and is playing with it.',
      ms: 'Kawan anda mengambil mainan anda tanpa bertanya dan sedang bermain dengannya.',
      zh: '你的朋友没有询问就拿走了你的玩具并在玩。'
    },
    category: 'assertiveness',
    choices: [
      {
        id: 'words',
        action: {
          en: 'Use words: "Please give that back"',
          ms: 'Gunakan kata-kata: "Tolong pulangkan itu"',
          zh: '用语言说："请还给我"'
        },
        isCorrect: true,
        icon: '🗣️'
      },
      {
        id: 'push',
        action: {
          en: 'Push them',
          ms: 'Tolak mereka',
          zh: '推他们'
        },
        isCorrect: false,
        icon: '👊'
      }
    ],
    explanation: {
      en: 'Using calm, clear words is the best way to solve problems. Pushing can hurt someone and doesn\'t solve anything.',
      ms: 'Menggunakan kata-kata yang tenang dan jelas adalah cara terbaik untuk menyelesaikan masalah. Menolak boleh menyakiti seseorang dan tidak menyelesaikan apa-apa.',
      zh: '用平静、清楚的话语是解决问题的最好方式。推人会伤害别人而且解决不了任何问题。'
    }
  },

  // Game Rules - Tag
  {
    id: 3,
    emoji: '🏃',
    situation: {
      en: 'You are playing tag and someone tags you gently',
      ms: 'Anda bermain kejar-kejar dan seseorang menyentuh anda dengan lembut',
      zh: '你在玩捉人游戏，有人轻轻碰了你'
    },
    context: {
      en: 'You agreed to play tag on the playground, and a friend gently touches your arm to tag you.',
      ms: 'Anda bersetuju untuk bermain kejar-kejar di taman permainan, dan kawan menyentuh lengan anda dengan lembut untuk menandakan anda.',
      zh: '你同意在操场上玩捉人游戏，朋友轻轻碰了你的手臂来标记你。'
    },
    category: 'game-rules',
    choices: [
      {
        id: 'game',
        action: {
          en: 'It\'s part of the game (Safe)',
          ms: 'Ia adalah sebahagian daripada permainan (Selamat)',
          zh: '这是游戏的一部分（安全）'
        },
        isCorrect: true,
        icon: '✅'
      },
      {
        id: 'yell',
        action: {
          en: 'Yell at them',
          ms: 'Menjerit kepada mereka',
          zh: '对他们大喊'
        },
        isCorrect: false,
        icon: '😠'
      }
    ],
    explanation: {
      en: 'When you agree to play a game like tag, gentle touching is part of the game rules. That\'s different from unwanted touching!',
      ms: 'Apabila anda bersetuju bermain permainan seperti kejar-kejar, sentuhan lembut adalah sebahagian daripada peraturan permainan. Itu berbeza daripada sentuhan yang tidak diingini!',
      zh: '当你同意玩像捉人这样的游戏时，轻轻的触碰是游戏规则的一部分。这与不想要的触碰是不同的！'
    }
  },

  // Stranger Safety - Hair Touching
  {
    id: 4,
    emoji: '💇',
    situation: {
      en: 'A stranger touches your hair',
      ms: 'Orang asing menyentuh rambut anda',
      zh: '陌生人摸你的头发'
    },
    context: {
      en: 'Someone you don\'t know reaches out and touches your hair without asking.',
      ms: 'Seseorang yang anda tidak kenal menghulurkan tangan dan menyentuh rambut anda tanpa bertanya.',
      zh: '一个你不认识的人伸手摸你的头发，没有先问。'
    },
    category: 'stranger-safety',
    choices: [
      {
        id: 'smile',
        action: {
          en: 'Smile and do nothing',
          ms: 'Senyum dan tidak berbuat apa-apa',
          zh: '微笑不做任何事'
        },
        isCorrect: false,
        icon: '😊'
      },
      {
        id: 'stop',
        action: {
          en: 'Step back and say "Stop"',
          ms: 'Berundur dan katakan "Berhenti"',
          zh: '后退并说"停"'
        },
        isCorrect: true,
        icon: '🛑'
      }
    ],
    explanation: {
      en: 'Your body belongs to you! It\'s okay to tell anyone - even adults - to stop if they touch you without permission.',
      ms: 'Badan anda milik anda! Tidak mengapa untuk memberitahu sesiapa - walaupun orang dewasa - untuk berhenti jika mereka menyentuh anda tanpa kebenaran.',
      zh: '你的身体属于你自己！告诉任何人——即使是大人——在他们未经允许触碰你时停下来是没问题的。'
    }
  },

  // Asking Permission - Blocks
  {
    id: 5,
    emoji: '🧱',
    situation: {
      en: 'You want to play with a friend\'s blocks',
      ms: 'Anda ingin bermain dengan blok kawan',
      zh: '你想玩朋友的积木'
    },
    context: {
      en: 'Your friend is building with blocks and you want to join in.',
      ms: 'Kawan anda sedang membina dengan blok dan anda ingin menyertai.',
      zh: '你的朋友在搭积木，你想加入。'
    },
    category: 'asking-permission',
    choices: [
      {
        id: 'take',
        action: {
          en: 'Just take them',
          ms: 'Ambil sahaja',
          zh: '直接拿走'
        },
        isCorrect: false,
        icon: '✊'
      },
      {
        id: 'ask',
        action: {
          en: 'Ask "Can I play too?"',
          ms: 'Tanya "Boleh saya main sekali?"',
          zh: '问"我也可以玩吗？"'
        },
        isCorrect: true,
        icon: '🙋'
      }
    ],
    explanation: {
      en: 'Always ask before using someone else\'s things or joining their activity. Asking shows respect!',
      ms: 'Sentiasa bertanya sebelum menggunakan barang orang lain atau menyertai aktiviti mereka. Bertanya menunjukkan rasa hormat!',
      zh: '在使用别人的东西或加入他们的活动之前一定要先问。询问表示尊重！'
    }
  },

  // Boundaries - Unwanted Tickling
  {
    id: 6,
    emoji: '🤭',
    situation: {
      en: 'Someone keeps tickling you even though you asked them to stop',
      ms: 'Seseorang terus menggelitik anda walaupun anda sudah minta berhenti',
      zh: '有人一直挠你痒痒，即使你已经让他们停下来'
    },
    context: {
      en: 'A friend thinks it\'s funny to tickle you, but you don\'t like it and already said stop.',
      ms: 'Seorang kawan rasa kelakar untuk menggelitik anda, tetapi anda tidak suka dan sudah kata berhenti.',
      zh: '朋友觉得挠你痒痒很好玩，但你不喜欢而且已经说停下来了。'
    },
    category: 'boundaries',
    choices: [
      {
        id: 'laugh',
        action: {
          en: 'Just laugh along',
          ms: 'Ketawa sahaja bersama',
          zh: '跟着笑就好'
        },
        isCorrect: false,
        icon: '😅'
      },
      {
        id: 'firm',
        action: {
          en: 'Say firmly "STOP. I don\'t like that."',
          ms: 'Katakan dengan tegas "BERHENTI. Saya tidak suka itu."',
          zh: '坚定地说"停下来。我不喜欢这样。"'
        },
        isCorrect: true,
        icon: '✋'
      }
    ],
    explanation: {
      en: 'When someone doesn\'t stop after you ask nicely, use a firm voice. You have the right to say NO to any touch you don\'t like!',
      ms: 'Apabila seseorang tidak berhenti selepas anda minta dengan baik, gunakan suara yang tegas. Anda mempunyai hak untuk kata TIDAK kepada sebarang sentuhan yang anda tidak suka!',
      zh: '当有人在你好好说之后还不停下来时，用坚定的声音说。你有权对任何你不喜欢的触碰说不！'
    }
  },

  // Conflict Resolution - Toy Sharing
  {
    id: 7,
    emoji: '🎮',
    situation: {
      en: 'A friend took your toy without asking',
      ms: 'Seorang kawan mengambil mainan anda tanpa bertanya',
      zh: '朋友没有问就拿走了你的玩具'
    },
    context: {
      en: 'You were playing with your favorite toy and your friend just grabbed it.',
      ms: 'Anda sedang bermain dengan mainan kegemaran anda dan kawan anda terus sahaja ambil.',
      zh: '你正在玩你最喜欢的玩具，朋友直接拿走了。'
    },
    category: 'conflict-resolution',
    choices: [
      {
        id: 'hit',
        action: {
          en: 'Hit them to get it back',
          ms: 'Pukul mereka untuk dapatkan semula',
          zh: '打他们把玩具抢回来'
        },
        isCorrect: false,
        icon: '👊'
      },
      {
        id: 'words',
        action: {
          en: 'Use words: "Please ask before taking my things"',
          ms: 'Guna kata-kata: "Tolong tanya sebelum ambil barang saya"',
          zh: '用语言："拿我的东西之前请先问一下"'
        },
        isCorrect: true,
        icon: '🗣️'
      }
    ],
    explanation: {
      en: 'We use words, not hands, to solve problems. Speaking up calmly is always the best choice!',
      ms: 'Kita guna kata-kata, bukan tangan, untuk selesaikan masalah. Bercakap dengan tenang sentiasa pilihan terbaik!',
      zh: '我们用语言而不是动手来解决问题。冷静地说出来总是最好的选择！'
    }
  },

  // Assertiveness - Snack Sharing
  {
    id: 8,
    emoji: '🍪',
    situation: {
      en: 'Someone keeps asking for your snack even though you said no',
      ms: 'Seseorang terus minta snek anda walaupun anda sudah kata tidak',
      zh: '有人一直问你要零食，即使你已经说了不'
    },
    context: {
      en: 'You have a cookie and a friend keeps asking you to share even though you already said no once.',
      ms: 'Anda ada biskut dan kawan terus minta anda berkongsi walaupun anda sudah kata tidak sekali.',
      zh: '你有一块饼干，朋友一直问你分享，尽管你已经说过一次不了。'
    },
    category: 'assertiveness',
    choices: [
      {
        id: 'give',
        action: {
          en: 'Just give it to them so they stop asking',
          ms: 'Bagi sahaja supaya mereka berhenti bertanya',
          zh: '给他们算了这样他们就不问了'
        },
        isCorrect: false,
        icon: '😔'
      },
      {
        id: 'repeat',
        action: {
          en: 'Say clearly: "I said no. Please stop asking."',
          ms: 'Katakan dengan jelas: "Saya kata tidak. Tolong berhenti bertanya."',
          zh: '清楚地说："我说了不。请别再问了。"'
        },
        isCorrect: true,
        icon: '✋'
      }
    ],
    explanation: {
      en: 'It\'s okay to say no and keep saying no! Your snack is yours and you get to decide who you share with.',
      ms: 'Tidak mengapa kata tidak dan terus kata tidak! Snek anda milik anda dan anda yang tentukan siapa anda mahu kongsi.',
      zh: '说不没关系，继续说不也没关系！你的零食是你的，你决定和谁分享。'
    }
  },

  // Boundaries - Personal Space
  {
    id: 9,
    emoji: '👫',
    situation: {
      en: 'Someone is standing too close to you and it makes you uncomfortable',
      ms: 'Seseorang berdiri terlalu dekat dengan anda dan ia membuatkan anda tidak selesa',
      zh: '有人站得离你太近，让你感到不舒服'
    },
    context: {
      en: 'While waiting in line, another kid is standing right behind you, touching you with their body.',
      ms: 'Semasa beratur, kanak-kanak lain berdiri tepat di belakang anda, menyentuh anda dengan badan mereka.',
      zh: '排队时，另一个孩子站在你正后方，身体碰到你。'
    },
    category: 'boundaries',
    choices: [
      {
        id: 'ignore',
        action: {
          en: 'Just ignore it and feel uncomfortable',
          ms: 'Abaikan sahaja dan rasa tidak selesa',
          zh: '忽略它继续不舒服'
        },
        isCorrect: false,
        icon: '😣'
      },
      {
        id: 'polite',
        action: {
          en: 'Say politely: "Could you please step back a little?"',
          ms: 'Katakan dengan sopan: "Boleh tolong berundur sedikit?"',
          zh: '礼貌地说："你能往后站一点吗？"'
        },
        isCorrect: true,
        icon: '🙂'
      }
    ],
    explanation: {
      en: 'Everyone needs their personal space. It\'s okay to politely ask for more room when you need it!',
      ms: 'Semua orang perlukan ruang peribadi. Tidak mengapa untuk minta ruang lebih dengan sopan bila anda perlukannya!',
      zh: '每个人都需要个人空间。当你需要时，礼貌地请求更多空间是完全可以的！'
    }
  },

  // Asking for Help - Feeling Unsafe
  {
    id: 10,
    emoji: '😰',
    situation: {
      en: 'An adult you don\'t know well makes you feel uncomfortable',
      ms: 'Orang dewasa yang anda tidak kenal dengan baik membuatkan anda rasa tidak selesa',
      zh: '一个你不太熟悉的大人让你感到不舒服'
    },
    context: {
      en: 'A grownup at a party keeps asking you to sit on their lap and it makes your tummy feel weird.',
      ms: 'Orang dewasa di pesta terus minta anda duduk di pangkuan mereka dan ia membuatkan perut anda rasa pelik.',
      zh: '派对上一个大人一直让你坐在他们腿上，这让你肚子感觉怪怪的。'
    },
    category: 'boundaries',
    choices: [
      {
        id: 'obey',
        action: {
          en: 'Do what they ask because they\'re an adult',
          ms: 'Buat apa yang mereka minta kerana mereka orang dewasa',
          zh: '照做因为他们是大人'
        },
        isCorrect: false,
        icon: '😔'
      },
      {
        id: 'tellparent',
        action: {
          en: 'Say no and tell a trusted adult',
          ms: 'Kata tidak dan beritahu orang dewasa yang dipercayai',
          zh: '说不并告诉你信任的大人'
        },
        isCorrect: true,
        icon: '🦸'
      }
    ],
    explanation: {
      en: 'If something feels wrong, trust your feelings! Always tell a parent or trusted adult when someone makes you feel uncomfortable.',
      ms: 'Jika sesuatu rasa tidak betul, percaya perasaan anda! Sentiasa beritahu ibu bapa atau orang dewasa yang dipercayai bila seseorang membuatkan anda rasa tidak selesa.',
      zh: '如果感觉不对，相信你的感觉！当有人让你感到不舒服时，一定要告诉父母或信任的大人。'
    }
  },

  // Conflict Resolution - Name Calling
  {
    id: 11,
    emoji: '😢',
    situation: {
      en: 'Someone calls you a mean name',
      ms: 'Seseorang memanggil anda dengan nama yang jahat',
      zh: '有人叫你难听的名字'
    },
    context: {
      en: 'A kid at school calls you a name that hurts your feelings.',
      ms: 'Kanak-kanak di sekolah memanggil anda nama yang menyakitkan perasaan anda.',
      zh: '学校里有个孩子叫你难听的名字伤害了你的感情。'
    },
    category: 'conflict-resolution',
    choices: [
      {
        id: 'nameback',
        action: {
          en: 'Call them a mean name back',
          ms: 'Balas panggil mereka dengan nama jahat',
          zh: '用难听的名字骂回去'
        },
        isCorrect: false,
        icon: '😠'
      },
      {
        id: 'adult',
        action: {
          en: 'Walk away and tell an adult',
          ms: 'Jalan pergi dan beritahu orang dewasa',
          zh: '走开并告诉大人'
        },
        isCorrect: true,
        icon: '🚶'
      }
    ],
    explanation: {
      en: 'Calling names back just makes things worse. Walk away and tell a teacher or adult who can help.',
      ms: 'Balas panggil nama cuma akan memburukkan keadaan. Jalan pergi dan beritahu guru atau orang dewasa yang boleh bantu.',
      zh: '骂回去只会让事情变得更糟。走开并告诉老师或能帮助的大人。'
    }
  },

  // Assertiveness - Speaking Up
  {
    id: 12,
    emoji: '🙋',
    situation: {
      en: 'Your friend always decides what game to play',
      ms: 'Kawan anda sentiasa tentukan permainan apa untuk dimainkan',
      zh: '你的朋友总是决定玩什么游戏'
    },
    context: {
      en: 'Every time you play together, your friend picks the game and never asks what you want.',
      ms: 'Setiap kali anda bermain bersama, kawan anda pilih permainan dan tidak pernah tanya apa yang anda mahu.',
      zh: '每次一起玩，你的朋友都选游戏，从来不问你想玩什么。'
    },
    category: 'assertiveness',
    choices: [
      {
        id: 'silent',
        action: {
          en: 'Stay quiet and just go along',
          ms: 'Diam sahaja dan ikut sahaja',
          zh: '保持沉默跟着玩就好'
        },
        isCorrect: false,
        icon: '🤐'
      },
      {
        id: 'suggest',
        action: {
          en: 'Say: "Can we take turns choosing games?"',
          ms: 'Katakan: "Boleh kita bergilir pilih permainan?"',
          zh: '说："我们可以轮流选游戏吗？"'
        },
        isCorrect: true,
        icon: '💬'
      }
    ],
    explanation: {
      en: 'Your ideas matter too! Good friends take turns and listen to each other\'s ideas.',
      ms: 'Idea anda juga penting! Kawan baik bergilir dan dengar idea masing-masing.',
      zh: '你的想法也很重要！好朋友会轮流并听取彼此的意见。'
    }
  },

  // Boundaries - Secrets
  {
    id: 13,
    emoji: '🤫',
    situation: {
      en: 'Someone asks you to keep a secret that makes you feel bad',
      ms: 'Seseorang minta anda simpan rahsia yang membuatkan anda rasa buruk',
      zh: '有人让你保守一个让你感觉不好的秘密'
    },
    context: {
      en: 'An older kid shows you something that makes you uncomfortable and says "Don\'t tell anyone."',
      ms: 'Kanak-kanak yang lebih tua tunjukkan anda sesuatu yang membuatkan anda tidak selesa dan kata "Jangan beritahu sesiapa."',
      zh: '一个大孩子给你看了让你不舒服的东西并说"不要告诉任何人。"'
    },
    category: 'boundaries',
    choices: [
      {
        id: 'keepit',
        action: {
          en: 'Keep the secret because they told me to',
          ms: 'Simpan rahsia kerana mereka suruh',
          zh: '保守秘密因为他们叫我这样做'
        },
        isCorrect: false,
        icon: '🤐'
      },
      {
        id: 'tellparent',
        action: {
          en: 'Tell a trusted adult right away',
          ms: 'Beritahu orang dewasa yang dipercayai dengan segera',
          zh: '马上告诉信任的大人'
        },
        isCorrect: true,
        icon: '🗣️'
      }
    ],
    explanation: {
      en: 'Secrets that make you feel bad or scared are NOT okay to keep. Always tell a parent or trusted adult!',
      ms: 'Rahsia yang membuatkan anda rasa buruk atau takut TIDAK patut disimpan. Sentiasa beritahu ibu bapa atau orang dewasa yang dipercayai!',
      zh: '让你感觉不好或害怕的秘密不应该保守。一定要告诉父母或信任的大人！'
    }
  },

  // Asking Permission - Using Phone
  {
    id: 14,
    emoji: '📱',
    situation: {
      en: 'You want to use your parent\'s phone',
      ms: 'Anda mahu guna telefon ibu bapa',
      zh: '你想用父母的手机'
    },
    context: {
      en: 'Your parent left their phone on the table and you want to play a game on it.',
      ms: 'Ibu bapa anda tinggalkan telefon di atas meja dan anda mahu main permainan.',
      zh: '你的父母把手机放在桌上，你想用它玩游戏。'
    },
    category: 'asking-permission',
    choices: [
      {
        id: 'take',
        action: {
          en: 'Just pick it up and start playing',
          ms: 'Ambil sahaja dan mula bermain',
          zh: '直接拿起来开始玩'
        },
        isCorrect: false,
        icon: '😈'
      },
      {
        id: 'ask',
        action: {
          en: 'Ask: "May I please use your phone?"',
          ms: 'Tanya: "Boleh saya guna telefon?"',
          zh: '问："我可以用你的手机吗？"'
        },
        isCorrect: true,
        icon: '🙋'
      }
    ],
    explanation: {
      en: 'Always ask permission before using someone else\'s things, even if it\'s your parent\'s!',
      ms: 'Sentiasa minta izin sebelum guna barang orang lain, walaupun barang ibu bapa!',
      zh: '在使用别人的东西之前一定要先问，即使是父母的东西！'
    }
  },

  // Conflict Resolution - Being Left Out
  {
    id: 15,
    emoji: '😞',
    situation: {
      en: 'Your friends are playing without you',
      ms: 'Kawan-kawan anda bermain tanpa anda',
      zh: '你的朋友们在玩没有叫你'
    },
    context: {
      en: 'At recess, you see your friends playing a game but they didn\'t ask you to join.',
      ms: 'Semasa rehat, anda nampak kawan-kawan bermain permainan tetapi mereka tidak ajak anda sertai.',
      zh: '课间休息时，你看到朋友们在玩游戏但他们没有邀请你加入。'
    },
    category: 'conflict-resolution',
    choices: [
      {
        id: 'angry',
        action: {
          en: 'Get angry and yell at them',
          ms: 'Marah dan jerit kepada mereka',
          zh: '生气并对他们大喊'
        },
        isCorrect: false,
        icon: '😡'
      },
      {
        id: 'askjoin',
        action: {
          en: 'Ask calmly: "Can I play with you?"',
          ms: 'Tanya dengan tenang: "Boleh saya main dengan kamu?"',
          zh: '平静地问："我可以和你们一起玩吗？"'
        },
        isCorrect: true,
        icon: '🙂'
      }
    ],
    explanation: {
      en: 'Sometimes friends forget to include everyone. Asking nicely usually works better than getting upset!',
      ms: 'Kadang-kadang kawan lupa sertakan semua orang. Bertanya dengan baik biasanya lebih berkesan daripada marah!',
      zh: '有时候朋友会忘记包括每个人。好好问通常比生气更有效！'
    }
  },
];

export function WhatWouldYouDo({ onBack }: WhatWouldYouDoProps) {
  const { language } = useLanguage();
  const t = useTranslation();
  const [gameState, setGameState] = useState<GameState>('setup');
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const startGame = (length: number) => {
    const shuffled = [...scenarioPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, length);
    setSelectedScenarios(selected);
    setSessionLength(length);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setWaitingForChoice(false);
  };

  const currentScenario = selectedScenarios[currentIndex];

  const handleReadNow = () => {
    setWaitingForChoice(true);
  };

  const handleChoice = (choice: Choice) => {
    if (!waitingForChoice) return;

    setSelectedChoice(choice);
    setIsCorrect(choice.isCorrect);
    
    if (choice.isCorrect) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    
    setGameState('feedback');
  };

  const handleContinue = () => {
    if (currentIndex < selectedScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGameState('playing');
      setWaitingForChoice(false);
      setSelectedChoice(null);
    } else {
      setGameState('complete');
    }
  };

  const playSound = (type: 'correct' | 'incorrect') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'correct') {
        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        oscillator.frequency.value = 200;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
      
      oscillator.start(audioContext.currentTime);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8 flex items-center justify-center">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🤔</div>
            <h2 className="mb-4 text-orange-700">{t.whatWouldYouDoTitle}</h2>
            <p className="text-xl text-gray-700 mb-2">{t.practiceGoodChoices}</p>
            <p className="text-gray-600">{t.chooseScenariosToSolve}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-center mb-6">{t.chooseGameLength}</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[5, 10, 15].map((length) => (
                <button
                  key={length}
                  onClick={() => setSessionLength(length)}
                  className={`p-6 rounded-2xl border-4 transition-all hover:scale-105 ${
                    sessionLength === length
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="text-5xl mb-2">{length}</div>
                  <p className="text-sm text-gray-600">{t.scenarios}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(sessionLength)}
              className="w-full py-6 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all hover:scale-105 text-xl"
            >
              {t.startGame}
            </button>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
            <h4 className="mb-3 text-purple-800">{t.whatYoullLearn}:</h4>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-2xl">💪</span>
                <span><strong>{t.beingAssertive}</strong> {t.standingUpRespectfully}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🛡️</span>
                <span><strong>{t.personalBoundaries}</strong> {t.sayingNoToThings}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🗣️</span>
                <span><strong>{t.usingWords}</strong> {t.solvingProblemsByTalking}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (gameState === 'complete') {
    const percentage = Math.round((score / sessionLength) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="mb-4 text-orange-700">{t.amazingChoices}</h2>
            <p className="text-3xl mb-6">{t.youMadeGoodChoices}</p>
            <p className="text-6xl mb-8">
              <span className="text-orange-600">{score}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-600">{sessionLength}</span>
              <span className="text-2xl text-gray-500"> {t.times}</span>
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-16 h-16 transition-all ${
                    star <= stars
                      ? 'text-yellow-400 fill-yellow-400 animate-pulse'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-xl text-gray-600">
              {percentage >= 90
                ? t.youKnowHowToHandle
                : percentage >= 70
                ? t.greatJobMakingChoices
                : t.everyChoiceHelpsLearn}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('setup')}
              className="px-8 py-5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <RotateCcw className="w-6 h-6" />
              {t.playAgain}
            </button>
            <button
              onClick={onBack}
              className="px-8 py-5 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all hover:scale-105 flex items-center gap-3 text-xl"
            >
              <Home className="w-6 h-6" />
              {t.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Feedback Screen
  if (gameState === 'feedback') {
    const correctChoice = currentScenario.choices.find(c => c.isCorrect);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div 
            className={`rounded-3xl p-12 shadow-2xl border-8 text-center ${
              isCorrect 
                ? 'bg-green-50 border-green-500' 
                : 'bg-orange-50 border-orange-500'
            }`}
          >
            <div className="text-9xl mb-6">
              {isCorrect ? '✅' : '🤔'}
            </div>
            
            <h3 className={`mb-6 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
              {isCorrect ? t.greatChoice : t.letsLearnTogether}
            </h3>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="text-6xl mb-4">{currentScenario.emoji}</div>
              <p className="text-xl mb-2">{currentScenario.situation[language]}</p>
              
              {selectedChoice && (
                <div className={`mt-4 p-4 rounded-xl border-4 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="text-4xl mb-2">{selectedChoice.icon}</div>
                  <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {t.youChose}: <strong>{selectedChoice.action[language]}</strong>
                  </p>
                </div>
              )}

              {!isCorrect && correctChoice && (
                <div className="mt-4 p-4 bg-green-50 border-4 border-green-500 rounded-xl">
                  <p className="text-green-700 mb-2">
                    <strong>{t.betterChoice}:</strong>
                  </p>
                  <div className="text-4xl mb-2">{correctChoice.icon}</div>
                  <p className="text-green-700">{correctChoice.action[language]}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>{t.why}?</strong> {currentScenario.explanation[language]}
              </p>
            </div>

            {!isCorrect && (
              <p className="text-orange-600 mb-6">
                {t.situationsCanBeConfusing}
              </p>
            )}

            <button
              onClick={handleContinue}
              className={`px-12 py-6 text-white rounded-full text-xl transition-all hover:scale-105 ${
                isCorrect 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {currentIndex < selectedScenarios.length - 1 ? t.nextScenario : t.seeResults}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-full px-6 py-3 shadow-lg">
          <span className="text-lg">
            {t.scenario} <span className="text-orange-600">{currentIndex + 1}</span> / {sessionLength}
          </span>
        </div>

        <button
          onClick={onBack}
          className="p-4 bg-red-50 border-2 border-red-300 rounded-full hover:bg-red-100 transition-all hover:scale-105"
        >
          <Home className="w-6 h-6 text-red-600" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-orange-400 to-yellow-600 h-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / sessionLength) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="max-w-2xl mx-auto mb-6">
        <div 
          className={`rounded-2xl p-4 text-center transition-all ${
            waitingForChoice 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-orange-50 border-2 border-orange-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" style={{ color: waitingForChoice ? '#16a34a' : '#f97316' }} />
            <p style={{ color: waitingForChoice ? '#16a34a' : '#f97316' }}>
              {waitingForChoice 
                ? `👇 ${t.whatWouldYouDo}? ${t.tapYourChoice}` 
                : `👇 ${t.readScenarioThen}!`}
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-orange-200">
          <div className="text-center mb-6">
            <div className="text-9xl mb-4">{currentScenario.emoji}</div>
            
            <div className="bg-orange-50 border-4 border-orange-300 rounded-2xl p-6 mb-4 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border-2 border-orange-300">
                <MessageSquare className="w-5 h-5 inline text-orange-600 mr-2" />
                <span className="text-sm">{t.situation}</span>
              </div>
              <h3 className="text-orange-700 mb-3 mt-2">{currentScenario.situation[language]}</h3>
              <p className="text-gray-700">{currentScenario.context[language]}</p>
            </div>

            <div className="inline-block px-4 py-2 bg-purple-50 border-2 border-purple-300 rounded-full mb-6">
              <span className="text-sm text-purple-700 capitalize">
                {currentScenario.category === 'assertiveness' ? t.categoryAssertiveness :
                 currentScenario.category === 'boundaries' ? t.categoryBoundaries :
                 currentScenario.category === 'conflict-resolution' ? t.categoryConflictResolution :
                 currentScenario.category.replace('-', ' ')}
              </span>
            </div>
          </div>

          <button
            onClick={handleReadNow}
            disabled={waitingForChoice}
            className={`w-full py-5 rounded-2xl text-xl transition-all ${
              waitingForChoice
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
            }`}
          >
            {waitingForChoice ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-6 h-6" />
                {t.chooseYourAnswerBelow}
              </span>
            ) : (
              t.readyToChoose
            )}
          </button>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="max-w-3xl mx-auto">
        <h4 className="text-center mb-4 text-orange-700">{t.whatWouldYouDo}?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentScenario.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              disabled={!waitingForChoice}
              className={`group rounded-3xl p-8 border-4 transition-all ${
                waitingForChoice
                  ? 'bg-white border-blue-400 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 cursor-pointer'
                  : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="text-6xl mb-4">{choice.icon}</div>
                <p className="text-center text-lg">{choice.action[language]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
