// Lokr+ site — Privacy & Support page copy, PT/EN/ES (spec section 1 & 11)
window.LOKR_I18N_LEGAL = {
  pt: {
    privacy: {
      eyebrow: "Política de privacidade · 27 de setembro de 2026",
      title: "O que o Lokr+ sabe sobre você: nada.",
      intro: "Sem conta, sem login, sem servidor nosso guardando seus dados. Este texto explica exatamente o que fica no seu aparelho, o que sai dele e por quê.",
      sections: [
        {
          h: "1. Não existe conta",
          p: "O Lokr+ não pede e-mail, telefone ou senha de cadastro. Não há login, não há usuário, não há servidor do Lokr+ para invadir — porque ele não existe."
        },
        {
          h: "2. O que fica no seu iPhone",
          p: "Título e site de cada item ficam em texto simples. Senha, usuário, e-mail, notas e código 2FA são criptografados com AES-GCM antes de tocar o disco. A chave de 32 bytes vive num arquivo protegido dentro do App Group do Lokr+, nunca em texto puro em lugar nenhum."
        },
        {
          h: "3. Face ID e o código do Lokr+",
          p: "Sua digital facial nunca sai do Secure Enclave do seu iPhone — o Lokr+ só recebe um \"sim\" ou \"não\" da Apple. O código do Lokr+ (diferente do código do seu iPhone) é guardado com PBKDF2 no Keychain, também só no aparelho."
        },
        {
          h: "4. Cofre isca",
          p: "Quem ativa o cofre isca (Pro) tem um segundo código que abre um cofre com as mesmas contas, mas senhas falsas. Os dois cofres são bancos de dados separados e nada no aparelho ou fora dele indica qual é o real."
        },
        {
          h: "5. Fora do backup",
          p: "A pasta do cofre é marcada para nunca entrar no backup do iCloud nem em backups feitos pelo computador. Isso é proteção: se um backup seu vazar, o cofre não vai junto. A consequência é que, se você apagar o app sem exportar antes, os dados não podem ser recuperados — nem por nós."
        },
        {
          h: "6. A única conexão à internet que o Lokr+ faz",
          p: "Ao checar vazamento de uma senha, o Lokr+ calcula um hash SHA-1 dela e manda só os 5 primeiros caracteres desse hash para a API pública Have I Been Pwned (k-anonimato). A senha e o hash completo nunca saem do aparelho, e nada dessa consulta fica guardado — nem lá, nem aqui."
        },
        {
          h: "7. Importar e exportar",
          p: "Import e export só acontecem quando você pede. Os arquivos (CSV ou .lokr criptografado) vão para onde você escolher — Arquivos, AirDrop, e-mail. O Lokr+ não envia esses arquivos para lugar nenhum sozinho."
        },
        {
          h: "8. Compras",
          p: "O Pro é vendido pela App Store, via StoreKit. Cartão e dados de pagamento ficam com a Apple; o Lokr+ nunca vê esses dados, só recebe a confirmação de que a compra aconteceu."
        },
        {
          h: "9. Seus direitos na União Europeia (RGPD)",
          p: "Como o Lokr+ não coleta, armazena ou transmite dados pessoais para nenhum servidor nosso, não há praticamente nada sobre você em nossos sistemas para acessar, corrigir, apagar ou portar — os dados do seu cofre existem só no seu aparelho, sob seu controle. A única informação que sai do aparelho é o trecho anônimo de hash descrito na seção 6, que não identifica você e não fica guardado conosco. Ainda assim, se você mora no Espaço Econômico Europeu, Reino Unido ou Suíça, você tem os direitos garantidos pelo RGPD — acesso, retificação, apagamento, portabilidade, restrição e oposição ao tratamento. Para exercê-los ou tirar dúvidas, escreva para lokr.security.support@gmail.com; você também pode reclamar à autoridade de proteção de dados do seu país a qualquer momento."
        },
        {
          h: "10. Seus direitos na Califórnia e nos EUA (CCPA/CPRA)",
          p: "O Lokr+ nunca vende nem compartilha dados pessoais com terceiros — não há dados pessoais nos nossos servidores para vender, porque não existe servidor guardando os seus dados. Se você é residente da Califórnia, tem direito de saber quais informações são coletadas (nenhuma, além do que você mesmo nos envia por e-mail ao pedir suporte), de pedir a exclusão delas e de não sofrer discriminação por exercer esses direitos. Como não coletamos nem vendemos informação pessoal, essas garantias já estão atendidas por padrão; para qualquer pedido formal, escreva para lokr.security.support@gmail.com."
        },
        {
          h: "11. Mudanças e contato",
          p: "Se esta política mudar, a data no topo desta página muda junto. Dúvidas, pedidos ou preocupações: lokr.security.support@gmail.com."
        }
      ]
    },
    terms: {
      eyebrow: "Termos de uso · 27 de setembro de 2026",
      title: "As regras do jogo, em poucas palavras.",
      intro: "Ao baixar ou usar o Lokr+, você concorda com estes termos. Como o app guarda tudo só no seu aparelho, boa parte deles é sobre o que isso significa pra sua responsabilidade sobre os próprios dados.",
      sections: [
        {
          h: "1. Aceitação dos termos",
          p: "Ao instalar ou usar o Lokr+, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. Se você não concordar com algum ponto, não instale ou desinstale o app."
        },
        {
          h: "2. O que é o Lokr+",
          p: "O Lokr+ é um gerenciador de senhas que funciona inteiramente no seu iPhone, sem conta, sem servidor e sem sincronização automática entre aparelhos. Tudo o que o app faz com seus dados está descrito na Política de Privacidade."
        },
        {
          h: "3. Você é responsável pelos seus dados",
          p: "Não existe recuperação de código nem backup automático na nuvem — isso é intencional, por segurança. Se você esquecer o código do Lokr+, apagar o app sem exportar antes, ou exceder o limite de tentativas erradas, os dados do cofre são perdidos de forma permanente e não podem ser recuperados por nós. Fazer backups (exportar .lokr ou CSV) periodicamente é responsabilidade sua."
        },
        {
          h: "4. Planos Grátis e Pro",
          p: "O plano Pro é vendido através da App Store, via StoreKit, e está sujeito aos Termos de Serviço de Mídia da Apple. Cobranças, renovações e reembolsos são processados e regidos pela Apple — para pedir reembolso, use o suporte da própria App Store."
        },
        {
          h: "5. Uso permitido",
          p: "O Lokr+ é para uso pessoal e lícito. É proibido usar o app para fins ilegais, tentar contornar seus mecanismos de segurança, ou realizar engenharia reversa além do que a lei do seu país permitir expressamente."
        },
        {
          h: "6. Propriedade intelectual",
          p: "A marca Lokr+, o design do app e o código-fonte pertencem ao desenvolvedor. Usar o app não te dá nenhum direito de propriedade sobre eles, além da licença de uso pessoal concedida por estes termos."
        },
        {
          h: "7. Isenção de garantias",
          p: "O Lokr+ é fornecido \"como está\". Fazemos o possível para manter o app seguro e funcionando corretamente, mas não garantimos disponibilidade ininterrupta nem ausência total de falhas."
        },
        {
          h: "8. Limitação de responsabilidade",
          p: "Na máxima extensão permitida por lei, o desenvolvedor do Lokr+ não se responsabiliza por perda de dados, danos indiretos ou consequenciais decorrentes do uso do app — especialmente perdas ligadas a esquecimento de código ou falta de backup, cobertas na seção 3."
        },
        {
          h: "9. Idade mínima",
          p: "O Lokr+ é destinado a quem tem idade legal para consentir com estes termos sozinho, ou consentimento de um responsável quando a lei local exigir. Não coletamos intencionalmente dados de crianças, e como não há conta nem servidor, não há dados de ninguém — criança ou adulto — armazenados por nós."
        },
        {
          h: "10. Lei aplicável",
          p: "Estes termos são regidos pelas leis do Brasil, sem prejuízo dos direitos de proteção ao consumidor garantidos pela lei do seu país de residência, quando aplicável — inclusive para usuários na União Europeia, Reino Unido e Estados Unidos."
        },
        {
          h: "11. Mudanças e contato",
          p: "Se estes termos mudarem, a data no topo desta página muda junto. Dúvidas: lokr.security.support@gmail.com."
        }
      ]
    },
    support: {
      title: "Como podemos ajudar?",
      subtitle: "Respostas para as dúvidas mais comuns. Se a sua não resolver aqui, escreva pra gente.",
      contactTitle: "Fale com a gente",
      contactBody: "Respondemos em português, inglês ou espanhol, normalmente em até 2 dias úteis.",
      contactButton: "Enviar e-mail",
      faq: [
        {
          q: "Esqueci meu código do Lokr+. Dá pra recuperar?",
          a: "Não. O código não fica guardado em lugar nenhum além do seu aparelho, e não existe conta para recuperá-lo. Se o Face ID também falhar, a única saída hoje é apagar e reinstalar o app — o que apaga todos os dados, a não ser que você tenha um backup exportado (.lokr ou CSV) guardado em outro lugar."
        },
        {
          q: "O que acontece depois de 10 erros?",
          a: "Face ID e código do Lokr+ contam juntos (o código do iPhone não entra nessa conta). Ao chegar no limite — 10 no Grátis, de 3 a 20 no Pro — o Lokr+ apaga todos os itens do cofre, limpa o banco local com segurança e gera uma nova chave de criptografia. Não dá pra desfazer."
        },
        {
          q: "Troquei de iPhone. Como levo minhas senhas?",
          a: "Exporte um arquivo .lokr (criptografado) ou CSV no aparelho antigo, transfira do jeito que preferir — AirDrop, e-mail, Arquivos — e importe no Lokr+ do novo iPhone. Ainda não existe sincronização automática entre aparelhos."
        },
        {
          q: "Por que o cofre não vai pro backup do iCloud?",
          a: "É uma escolha de segurança: se um backup seu for comprometido, o cofre não vai junto. O outro lado dessa moeda é que perder ou apagar o app sem ter exportado antes significa perder os dados de vez."
        },
        {
          q: "Como funciona o cofre isca?",
          a: "Você define um segundo código (Pro), diferente do seu código real. Se alguém te obrigar a abrir o Lokr+, digite esse código: ele abre um cofre com as mesmas contas do seu, mas com senhas falsas, enquanto o cofre de verdade continua escondido. Nada na tela ou no registro de acessos entrega a diferença."
        },
        {
          q: "Como ativo o preenchimento automático?",
          a: "No iPhone, vá em Ajustes → Senhas → Aplicativo de Preenchimento de Senhas, e ative o Lokr+. Depois disso, ao tocar num campo de login em qualquer app ou no Safari, o ícone de chave no teclado abre o Lokr+ para preencher."
        },
        {
          q: "Comprei o Pro e ele não aparece?",
          a: "Abra a tela de compra do Pro e toque em \"Restaurar compra\", conectado à mesma conta da App Store usada na compra. Se ainda assim não desbloquear, escreva pra gente com o e-mail da conta da App Store."
        }
      ]
    },
    common: { privacyLink: "Privacidade" }
  },

  en: {
    privacy: {
      eyebrow: "Privacy policy · September 27, 2026",
      title: "What Lokr+ knows about you: nothing.",
      intro: "No account, no login, no server of ours holding your data. This page explains exactly what stays on your device, what leaves it, and why.",
      sections: [
        {
          h: "1. There is no account",
          p: "Lokr+ never asks for an email, phone number, or sign-up password. There's no login, no user, no Lokr+ server to break into — because it doesn't exist."
        },
        {
          h: "2. What stays on your iPhone",
          p: "Each item's title and site are stored in plain text. Password, username, email, notes, and 2FA codes are encrypted with AES-GCM before they touch disk. The 32-byte key lives in a protected file inside Lokr+'s App Group, never in plain text anywhere."
        },
        {
          h: "3. Face ID and the Lokr+ code",
          p: "Your face never leaves your iPhone's Secure Enclave — Lokr+ only gets a yes/no from Apple. The Lokr+ code (different from your iPhone's own code) is stored with PBKDF2 in the Keychain, also only on the device."
        },
        {
          h: "4. Decoy vault",
          p: "Anyone who turns on the decoy vault (Pro) gets a second code that opens a vault with the same accounts but fake passwords. The two vaults are separate databases, and nothing on or off the device points to which one is real."
        },
        {
          h: "5. Kept out of the backup",
          p: "The vault's folder is flagged to never enter an iCloud backup or a computer backup. That's a protection: if one of your backups leaks, the vault doesn't go with it. The trade-off is that deleting the app without exporting first means the data can't be recovered — not even by us."
        },
        {
          h: "6. The one internet connection Lokr+ makes",
          p: "When checking a password for leaks, Lokr+ computes its SHA-1 hash and sends only the first 5 characters of that hash to the public Have I Been Pwned API (k-anonymity). The password and the full hash never leave the device, and nothing about that lookup is stored — not there, not here."
        },
        {
          h: "7. Import and export",
          p: "Import and export only happen when you ask for them. The files (CSV or encrypted .lokr) go wherever you choose — Files, AirDrop, email. Lokr+ never sends those files anywhere on its own."
        },
        {
          h: "8. Purchases",
          p: "Pro is sold through the App Store, via StoreKit. Card and payment details stay with Apple; Lokr+ never sees them, it only receives confirmation that the purchase happened."
        },
        {
          h: "9. Your rights in the European Union (GDPR)",
          p: "Because Lokr+ doesn't collect, store, or transmit personal data to any server of ours, there's essentially nothing about you on our systems to access, correct, erase, or port — your vault's data exists only on your device, under your control. The one piece of information that leaves the device is the anonymous hash fragment described in section 6, which doesn't identify you and isn't stored by us. Still, if you're based in the European Economic Area, the UK, or Switzerland, you have the rights guaranteed by the GDPR — access, rectification, erasure, portability, restriction, and objection to processing. To exercise them or ask questions, write to lokr.security.support@gmail.com; you can also complain to your country's data protection authority at any time."
        },
        {
          h: "10. Your rights in California and the U.S. (CCPA/CPRA)",
          p: "Lokr+ never sells or shares personal data with third parties — there's no personal data on our servers to sell, because there's no server holding your data. If you're a California resident, you have the right to know what information is collected (none, beyond what you send us yourself by email when asking for support), to request its deletion, and to not be discriminated against for exercising these rights. Since we don't collect or sell personal information, these guarantees are already met by default; for any formal request, write to lokr.security.support@gmail.com."
        },
        {
          h: "11. Changes and contact",
          p: "If this policy changes, the date at the top of this page changes with it. Questions, requests, or concerns: lokr.security.support@gmail.com."
        }
      ]
    },
    terms: {
      eyebrow: "Terms of use · September 27, 2026",
      title: "The rules of the game, in a few words.",
      intro: "By downloading or using Lokr+, you agree to these terms. Since the app keeps everything only on your device, a good chunk of them is about what that means for your responsibility over your own data.",
      sections: [
        {
          h: "1. Accepting these terms",
          p: "By installing or using Lokr+, you agree to these Terms of Use and to our Privacy Policy. If you don't agree with any part of them, don't install the app, or uninstall it."
        },
        {
          h: "2. What Lokr+ is",
          p: "Lokr+ is a password manager that runs entirely on your iPhone, with no account, no server, and no automatic sync between devices. Everything the app does with your data is described in the Privacy Policy."
        },
        {
          h: "3. You're responsible for your data",
          p: "There's no code recovery and no automatic cloud backup — that's intentional, for security. If you forget your Lokr+ code, delete the app without exporting first, or go over the limit of wrong attempts, the vault's data is permanently lost and can't be recovered by us. Making periodic backups (exporting a .lokr file or CSV) is your responsibility."
        },
        {
          h: "4. Free and Pro plans",
          p: "The Pro plan is sold through the App Store, via StoreKit, and is subject to Apple's Media Services Terms. Charges, renewals, and refunds are processed and governed by Apple — to request a refund, use the App Store's own support."
        },
        {
          h: "5. Permitted use",
          p: "Lokr+ is for personal, lawful use. Using the app for illegal purposes, trying to circumvent its security mechanisms, or reverse-engineering it beyond what your local law expressly allows is prohibited."
        },
        {
          h: "6. Intellectual property",
          p: "The Lokr+ brand, the app's design, and its source code belong to the developer. Using the app doesn't grant you any ownership rights over them, beyond the personal-use license granted by these terms."
        },
        {
          h: "7. Disclaimer of warranties",
          p: "Lokr+ is provided \"as is.\" We do our best to keep the app secure and working correctly, but we don't guarantee uninterrupted availability or a complete absence of bugs."
        },
        {
          h: "8. Limitation of liability",
          p: "To the maximum extent permitted by law, the Lokr+ developer isn't liable for data loss or indirect or consequential damages arising from using the app — especially losses tied to a forgotten code or a missing backup, covered in section 3."
        },
        {
          h: "9. Minimum age",
          p: "Lokr+ is meant for people who are legally old enough to agree to these terms on their own, or who have a guardian's consent where local law requires it. We don't knowingly collect data from children, and since there's no account or server, there's no data — from a child or an adult — stored by us."
        },
        {
          h: "10. Governing law",
          p: "These terms are governed by the laws of Brazil, without prejudice to the consumer-protection rights guaranteed by the law of your country of residence, where applicable — including for users in the European Union, the United Kingdom, and the United States."
        },
        {
          h: "11. Changes and contact",
          p: "If these terms change, the date at the top of this page changes with them. Questions: lokr.security.support@gmail.com."
        }
      ]
    },
    support: {
      title: "How can we help?",
      subtitle: "Answers to the most common questions. If yours isn't here, write to us.",
      contactTitle: "Talk to us",
      contactBody: "We reply in Portuguese, English, or Spanish, usually within 2 business days.",
      contactButton: "Send an email",
      faq: [
        {
          q: "I forgot my Lokr+ code. Can it be recovered?",
          a: "No. The code isn't stored anywhere besides your device, and there's no account to recover it through. If Face ID also fails, the only option today is to delete and reinstall the app — which erases everything, unless you have an exported backup (.lokr or CSV) saved somewhere else."
        },
        {
          q: "What happens after 10 wrong attempts?",
          a: "Face ID and the Lokr+ code count together (your iPhone's own passcode doesn't count toward this). Once the limit is reached — 10 on Free, 3 to 20 on Pro — Lokr+ erases every item in the vault, securely wipes the local database, and generates a new encryption key. There's no undo."
        },
        {
          q: "I got a new iPhone. How do I bring my passwords over?",
          a: "Export an encrypted .lokr file or a CSV on the old device, transfer it however you like — AirDrop, email, Files — and import it into Lokr+ on the new iPhone. There's no automatic sync between devices yet."
        },
        {
          q: "Why doesn't the vault go into the iCloud backup?",
          a: "It's a security choice: if one of your backups is ever compromised, the vault doesn't go with it. The flip side is that losing or deleting the app without exporting first means losing the data for good."
        },
        {
          q: "How does the decoy vault work?",
          a: "You set a second code (Pro), different from your real one. If someone forces you to open Lokr+, type that code instead: it opens a vault with the same accounts as yours but fake passwords, while the real vault stays hidden. Nothing on screen or in the access log gives away the difference."
        },
        {
          q: "How do I turn on AutoFill?",
          a: "On your iPhone, go to Settings → Passwords → Password AutoFill, and turn Lokr+ on. After that, tapping a login field in any app or in Safari shows a key icon on the keyboard that opens Lokr+ to fill it in."
        },
        {
          q: "I bought Pro and it's not showing up?",
          a: "Open the Pro purchase screen and tap \"Restore purchase\" while signed into the same App Store account you used to buy it. If it still doesn't unlock, write to us with the email of that App Store account."
        }
      ]
    },
    common: { privacyLink: "Privacy" }
  },

  es: {
    privacy: {
      eyebrow: "Política de privacidad · 27 de septiembre de 2026",
      title: "Lo que Lokr+ sabe de ti: nada.",
      intro: "Sin cuenta, sin inicio de sesión, sin un servidor nuestro guardando tus datos. Este texto explica exactamente qué se queda en tu dispositivo, qué sale de él y por qué.",
      sections: [
        {
          h: "1. No existe una cuenta",
          p: "Lokr+ nunca pide correo, teléfono ni contraseña de registro. No hay inicio de sesión, no hay usuario, no hay un servidor de Lokr+ que hackear — porque no existe."
        },
        {
          h: "2. Lo que se queda en tu iPhone",
          p: "El título y el sitio de cada elemento se guardan en texto simple. Contraseña, usuario, correo, notas y código 2FA se cifran con AES-GCM antes de tocar el disco. La clave de 32 bytes vive en un archivo protegido dentro del App Group de Lokr+, nunca en texto plano en ningún otro lugar."
        },
        {
          h: "3. Face ID y el código de Lokr+",
          p: "Tu rostro nunca sale del Secure Enclave de tu iPhone — Lokr+ solo recibe un sí o un no de Apple. El código de Lokr+ (distinto del código de tu iPhone) se guarda con PBKDF2 en el Keychain, también solo en el dispositivo."
        },
        {
          h: "4. Caja señuelo",
          p: "Quien activa la caja señuelo (Pro) tiene un segundo código que abre una caja con las mismas cuentas, pero con contraseñas falsas. Las dos cajas son bases de datos separadas y nada, dentro o fuera del dispositivo, indica cuál es la real."
        },
        {
          h: "5. Fuera de la copia de seguridad",
          p: "La carpeta de la caja fuerte está marcada para no entrar nunca en la copia de seguridad de iCloud ni en la del ordenador. Eso es protección: si una de tus copias se filtra, la caja fuerte no va con ella. La contraparte es que borrar la app sin exportar antes significa que los datos no se pueden recuperar — ni siquiera por nosotros."
        },
        {
          h: "6. La única conexión a internet que hace Lokr+",
          p: "Al comprobar si una contraseña se filtró, Lokr+ calcula su hash SHA-1 y envía solo los 5 primeros caracteres de ese hash a la API pública Have I Been Pwned (k-anonimato). La contraseña y el hash completo nunca salen del dispositivo, y nada de esa consulta se guarda — ni allí, ni aquí."
        },
        {
          h: "7. Importar y exportar",
          p: "Importar y exportar solo ocurre cuando tú lo pides. Los archivos (CSV o .lokr cifrado) van adonde tú elijas — Archivos, AirDrop, correo. Lokr+ nunca envía esos archivos a ningún sitio por su cuenta."
        },
        {
          h: "8. Compras",
          p: "El Pro se vende a través de la App Store, vía StoreKit. Los datos de la tarjeta y el pago se quedan con Apple; Lokr+ nunca los ve, solo recibe la confirmación de que la compra ocurrió."
        },
        {
          h: "9. Tus derechos en la Unión Europea (RGPD)",
          p: "Como Lokr+ no recopila, almacena ni transmite datos personales a ningún servidor nuestro, prácticamente no hay nada sobre ti en nuestros sistemas para acceder, corregir, borrar o portar — los datos de tu caja fuerte existen solo en tu dispositivo, bajo tu control. La única información que sale del dispositivo es el fragmento anónimo de hash descrito en la sección 6, que no te identifica y no lo guardamos nosotros. Aun así, si resides en el Espacio Económico Europeo, el Reino Unido o Suiza, tienes los derechos garantizados por el RGPD — acceso, rectificación, supresión, portabilidad, limitación y oposición al tratamiento. Para ejercerlos o resolver dudas, escribe a lokr.security.support@gmail.com; también puedes reclamar ante la autoridad de protección de datos de tu país en cualquier momento."
        },
        {
          h: "10. Tus derechos en California y EE. UU. (CCPA/CPRA)",
          p: "Lokr+ nunca vende ni comparte datos personales con terceros — no hay datos personales en nuestros servidores para vender, porque no existe un servidor que guarde tus datos. Si eres residente de California, tienes derecho a saber qué información se recopila (ninguna, aparte de lo que tú mismo nos envías por correo al pedir soporte), a solicitar su eliminación y a no sufrir discriminación por ejercer estos derechos. Como no recopilamos ni vendemos información personal, estas garantías ya se cumplen por defecto; para cualquier solicitud formal, escribe a lokr.security.support@gmail.com."
        },
        {
          h: "11. Cambios y contacto",
          p: "Si esta política cambia, la fecha en la parte superior de esta página cambia con ella. Preguntas, solicitudes o inquietudes: lokr.security.support@gmail.com."
        }
      ]
    },
    terms: {
      eyebrow: "Términos de uso · 27 de septiembre de 2026",
      title: "Las reglas del juego, en pocas palabras.",
      intro: "Al descargar o usar Lokr+, aceptas estos términos. Como la app guarda todo solo en tu dispositivo, buena parte de ellos trata sobre lo que eso significa para tu responsabilidad sobre tus propios datos.",
      sections: [
        {
          h: "1. Aceptación de los términos",
          p: "Al instalar o usar Lokr+, aceptas estos Términos de Uso y nuestra Política de Privacidad. Si no estás de acuerdo con algún punto, no instales la app o desinstálala."
        },
        {
          h: "2. Qué es Lokr+",
          p: "Lokr+ es un gestor de contraseñas que funciona enteramente en tu iPhone, sin cuenta, sin servidor y sin sincronización automática entre dispositivos. Todo lo que la app hace con tus datos está descrito en la Política de Privacidad."
        },
        {
          h: "3. Eres responsable de tus datos",
          p: "No existe recuperación de código ni copia de seguridad automática en la nube — es intencional, por seguridad. Si olvidas el código de Lokr+, borras la app sin exportar antes, o superas el límite de intentos fallidos, los datos de la caja fuerte se pierden de forma permanente y no podemos recuperarlos. Hacer copias de seguridad periódicas (exportar un archivo .lokr o CSV) es responsabilidad tuya."
        },
        {
          h: "4. Planes Gratis y Pro",
          p: "El plan Pro se vende a través de la App Store, vía StoreKit, y está sujeto a los Términos de Servicios de Medios de Apple. Los cobros, renovaciones y reembolsos son procesados y regidos por Apple — para pedir un reembolso, usa el soporte de la propia App Store."
        },
        {
          h: "5. Uso permitido",
          p: "Lokr+ es para uso personal y lícito. Está prohibido usar la app con fines ilegales, intentar eludir sus mecanismos de seguridad, o realizar ingeniería inversa más allá de lo que la ley de tu país permita expresamente."
        },
        {
          h: "6. Propiedad intelectual",
          p: "La marca Lokr+, el diseño de la app y su código fuente pertenecen al desarrollador. Usar la app no te otorga ningún derecho de propiedad sobre ellos, más allá de la licencia de uso personal concedida por estos términos."
        },
        {
          h: "7. Exención de garantías",
          p: "Lokr+ se proporciona \"tal cual\". Hacemos lo posible por mantener la app segura y funcionando correctamente, pero no garantizamos disponibilidad ininterrumpida ni la ausencia total de fallos."
        },
        {
          h: "8. Limitación de responsabilidad",
          p: "En la máxima medida permitida por la ley, el desarrollador de Lokr+ no se hace responsable de la pérdida de datos ni de daños indirectos o consecuentes derivados del uso de la app — especialmente pérdidas ligadas a olvidar el código o no tener una copia de seguridad, cubiertas en la sección 3."
        },
        {
          h: "9. Edad mínima",
          p: "Lokr+ está dirigido a quienes tienen edad legal para aceptar estos términos por sí mismos, o cuentan con el consentimiento de un tutor cuando la ley local lo exija. No recopilamos intencionalmente datos de menores, y como no hay cuenta ni servidor, no guardamos datos de nadie — menor o adulto."
        },
        {
          h: "10. Ley aplicable",
          p: "Estos términos se rigen por las leyes de Brasil, sin perjuicio de los derechos de protección al consumidor garantizados por la ley de tu país de residencia, cuando corresponda — incluso para usuarios en la Unión Europea, el Reino Unido y los Estados Unidos."
        },
        {
          h: "11. Cambios y contacto",
          p: "Si estos términos cambian, la fecha en la parte superior de esta página cambia con ellos. Preguntas: lokr.security.support@gmail.com."
        }
      ]
    },
    support: {
      title: "¿Cómo podemos ayudarte?",
      subtitle: "Respuestas a las dudas más comunes. Si la tuya no está aquí, escríbenos.",
      contactTitle: "Habla con nosotros",
      contactBody: "Respondemos en portugués, inglés o español, normalmente en un plazo de 2 días hábiles.",
      contactButton: "Enviar correo",
      faq: [
        {
          q: "Olvidé mi código de Lokr+. ¿Se puede recuperar?",
          a: "No. El código no se guarda en ningún sitio más que en tu dispositivo, y no existe una cuenta para recuperarlo. Si Face ID también falla, hoy la única salida es borrar y reinstalar la app — lo que borra todos los datos, a menos que tengas una copia exportada (.lokr o CSV) guardada en otro lugar."
        },
        {
          q: "¿Qué pasa después de 10 errores?",
          a: "Face ID y el código de Lokr+ cuentan juntos (el código del iPhone no entra en esta cuenta). Al llegar al límite — 10 en el plan Gratis, de 3 a 20 en el Pro — Lokr+ borra todos los elementos de la caja fuerte, limpia la base de datos local de forma segura y genera una nueva clave de cifrado. No se puede deshacer."
        },
        {
          q: "Cambié de iPhone. ¿Cómo llevo mis contraseñas?",
          a: "Exporta un archivo .lokr (cifrado) o CSV en el dispositivo anterior, transfiérelo como prefieras — AirDrop, correo, Archivos — e impórtalo en el Lokr+ del nuevo iPhone. Todavía no existe sincronización automática entre dispositivos."
        },
        {
          q: "¿Por qué la caja fuerte no va a la copia de seguridad de iCloud?",
          a: "Es una decisión de seguridad: si una de tus copias de seguridad se ve comprometida, la caja fuerte no va con ella. La otra cara es que perder o borrar la app sin haber exportado antes significa perder los datos para siempre."
        },
        {
          q: "¿Cómo funciona la caja señuelo?",
          a: "Defines un segundo código (Pro), distinto de tu código real. Si alguien te obliga a abrir Lokr+, escribe ese código: abre una caja fuerte con las mismas cuentas que la tuya, pero con contraseñas falsas, mientras la caja real sigue escondida. Nada en la pantalla ni en el registro de accesos revela la diferencia."
        },
        {
          q: "¿Cómo activo el autocompletado?",
          a: "En tu iPhone, ve a Ajustes → Contraseñas → Autocompletar contraseñas, y activa Lokr+. Después de eso, al tocar un campo de inicio de sesión en cualquier app o en Safari, aparece un icono de llave en el teclado que abre Lokr+ para rellenarlo."
        },
        {
          q: "Compré el Pro y no aparece.",
          a: "Abre la pantalla de compra del Pro y toca \"Restaurar compra\", con la sesión iniciada en la misma cuenta de App Store que usaste para comprarlo. Si aun así no se desbloquea, escríbenos con el correo de esa cuenta de App Store."
        }
      ]
    },
    common: { privacyLink: "Privacidad" }
  }
};
