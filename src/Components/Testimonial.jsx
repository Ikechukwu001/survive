import { Star, Heart, MessageCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Kemi Adebayo",
    username: "@kemi_gamer",
    quote:
      "Abeg, this game don scatter my brain! I've been playing since 6am and I still can't stop. My mum is already shouting 'Kemi come and eat!' 😂",
    likes: 234,
    replies: 12,
    time: "2h",
  },
  {
    id: 2,
    name: "Chidi Okafor",
    username: "@chidi_pro",
    quote:
      "Guy, I thought I was good at games until I met this one. Now I'm questioning everything I know about life 🤣 But I'm addicted sha!",
    likes: 189,
    replies: 8,
    time: "4h",
  },
  {
    id: 3,
    name: "Fatima Hassan",
    username: "@fatima_plays",
    quote:
      "This game is not for the weak! I've been stuck on level 15 for 3 days. My roommate thinks I've lost my mind but I must conquer this thing!",
    likes: 156,
    replies: 23,
    time: "6h",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What Players Are Saying 🗣️</h2>
          <p className="text-gray-600 text-lg">
            Real reactions from our amazing community of players!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.username}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>

              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{item.quote}</p>

              <div className="flex gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                  <Heart className="w-4 h-4" />
                  <span>{item.likes}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{item.replies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <span className="text-gray-600">Try it out!</span>
            <span className="text-2xl">🎮</span>
          </div>
        </div>
      </div>
    </section>
  );
}
