import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface VoteStats {
  boy_votes: number;
  girl_votes: number;
  total_votes: number;
}

const VOTING_API = 'https://functions.poehali.dev/68cb9a0e-60ee-43ae-8b49-6aec14ef254f';

const Confetti = ({ delay = 0 }: { delay?: number }) => {
  const colors = ['#FF69B4', '#87CEEB', '#DA70D6', '#FFD700', '#98FB98'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomLeft = Math.random() * 100;
  const randomDelay = delay + Math.random() * 2;
  
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-confetti"
      style={{
        backgroundColor: randomColor,
        left: `${randomLeft}%`,
        animationDelay: `${randomDelay}s`,
      }}
    />
  );
};

export default function Index() {
  const [stats, setStats] = useState<VoteStats>({ boy_votes: 0, girl_votes: 0, total_votes: 0 });
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const response = await fetch(VOTING_API);
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (voteType: 'boy' | 'girl') => {
    if (hasVoted) {
      toast({
        title: 'Вы уже проголосовали!',
        description: 'Спасибо за участие 🎉',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(VOTING_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_type: voteType }),
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setHasVoted(true);
        toast({
          title: voteType === 'boy' ? '💙 Голос за мальчика!' : '💗 Голос за девочку!',
          description: 'Ваш голос учтён! Скоро узнаем результат 🎊',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить голос. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const boyPercentage = stats.total_votes > 0 ? (stats.boy_votes / stats.total_votes) * 100 : 50;
  const girlPercentage = stats.total_votes > 0 ? (stats.girl_votes / stats.total_votes) * 100 : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <Confetti key={i} delay={i * 0.1} />
      ))}

      <header className="py-6 px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-party-pink via-party-blue to-party-pink animate-pulse-glow" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          🎈 Gender Party! 🎈
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-700" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Скоро мы узнаем, кто появится на свет!
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <section className="mb-16 text-center">
          <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl mb-8 animate-float">
            <img
              src="https://cdn.poehali.dev/projects/0f687b3f-a5a8-454a-b8a7-ba0c8a5682b3/files/4694549a-2789-4905-b2b2-e55ba4b6d5d6.jpg"
              alt="Gender Party Celebration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </section>

        <section className="mb-16">
          <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-sm shadow-2xl border-4 border-party-gold">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🎉 О событии
            </h2>
            <p className="text-lg text-center text-gray-700 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Мы рады пригласить вас на праздник, где мы все вместе узнаем пол нашего малыша! 
              Это будет незабываемый день, полный сюрпризов, радости и волшебства. 
              Приготовьтесь к яркому шоу и весёлым моментам! ✨
            </p>
          </Card>
        </section>

        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-2 border-party-blue">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-party-blue/20 p-4 rounded-full">
                  <Icon name="Calendar" size={32} className="text-party-blue" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  📅 Дата
                </h3>
              </div>
              <p className="text-xl text-gray-700" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                15 декабря 2024, 18:00
              </p>
            </Card>

            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-2 border-party-pink">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-party-pink/20 p-4 rounded-full">
                  <Icon name="MapPin" size={32} className="text-party-pink" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  📍 Место
                </h3>
              </div>
              <p className="text-xl text-gray-700" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Банкетный зал "Радуга"<br />
                ул. Праздничная, д. 10
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-sm shadow-2xl border-4 border-party-gold">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🎪 Программа праздника
            </h2>
            <div className="space-y-6">
              {[
                { time: '18:00', event: 'Встреча гостей, welcome drinks 🥂', icon: 'Users' },
                { time: '18:30', event: 'Праздничный фуршет 🍰', icon: 'Cake' },
                { time: '19:00', event: 'Интерактивные игры и конкурсы 🎮', icon: 'Gamepad2' },
                { time: '19:30', event: 'Главный момент - раскрытие пола малыша! 🎊', icon: 'Sparkles' },
                { time: '20:00', event: 'Танцы и веселье 💃', icon: 'Music' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-blue-50 hover:shadow-lg transition-shadow">
                  <div className="bg-party-gold/30 p-3 rounded-full flex-shrink-0">
                    <Icon name={item.icon as any} size={24} className="text-party-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {item.time}
                    </p>
                    <p className="text-gray-700" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mb-16">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-party-pink/10 via-white to-party-blue/10 backdrop-blur-sm shadow-2xl border-4 border-party-gold">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🗳️ Проголосуй за пол малыша!
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Button
                onClick={() => handleVote('boy')}
                disabled={loading || hasVoted}
                className="h-24 text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-xl transform hover:scale-105 transition-all"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                💙 Мальчик
              </Button>
              
              <Button
                onClick={() => handleVote('girl')}
                disabled={loading || hasVoted}
                className="h-24 text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white shadow-xl transform hover:scale-105 transition-all"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                💗 Девочка
              </Button>
            </div>

            {stats.total_votes > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    Всего проголосовало: <span className="font-bold text-2xl text-party-gold">{stats.total_votes}</span> человек
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-blue-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        💙 Мальчик
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {stats.boy_votes} ({boyPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={boyPercentage} className="h-6 bg-blue-100" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-pink-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        💗 Девочка
                      </span>
                      <span className="text-2xl font-bold text-pink-600">
                        {stats.girl_votes} ({girlPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={girlPercentage} className="h-6 bg-pink-100" />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>

      <footer className="py-8 text-center relative z-10">
        <p className="text-gray-600 text-lg" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Будем рады видеть вас на празднике! 🎈✨
        </p>
        <p className="text-gray-500 mt-2">
          С любовью, будущие родители 💕
        </p>
      </footer>
    </div>
  );
}
