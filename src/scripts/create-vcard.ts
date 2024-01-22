import VCardsJS from "vcards-js"
// import type { vCard } from "vcards-js"
import { env } from "~/env"

// TODO P4 types don't build on vercel

// const twilioCard: vCard = VCardsJS()
const twilioCard = VCardsJS()

// twilioCard.firstName = "Twilio Number"
twilioCard.organization = "KYZN"
twilioCard.photo.embedFromFile("./public/pfp-brandmark-inv-offb.png")
twilioCard.logo.embedFromFile("./public/pfp-logotype-inv-offb.png")
twilioCard.cellPhone = env.TWILIO_NUMBER
// twilioCard.birthday = new Date(2008, 3, 18)
// twilioCard.title = "Title?"
twilioCard.url = "https://kyzn.app"

twilioCard.otherEmail = "support@kyzn.app"
twilioCard.source = "http://kyzn.app/vcards/kyzn.vcf"

// twilioCard.socialUrls['facebook'] = 'https://...';
// twilioCard.socialUrls['linkedIn'] = 'https://...';
// twilioCard.socialUrls['twitter'] = 'https://...';
// twilioCard.socialUrls['flickr'] = 'https://...';
twilioCard.socialUrls.TikTok = "https://www.instagram.com/kyzn.ai"
twilioCard.socialUrls.Instagram = "https://www.tiktok.com/@kyzn.ai"

twilioCard.saveToFile("./public/vcards/kyzn.vcf")

// https://github.com/enesser/vCards-js/commit/574c9ea4b77ca95b85872fe0c1e5f97e1a67be98

// modified for this commi

// Changed line 211-215 in formatVcard to change other email to support emial
