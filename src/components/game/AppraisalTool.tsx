import { useState } from 'react';
import { Item } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { performAppraisal, AppraisalResult } from '@/utils/fakeDetection';

interface AppraisalToolProps {
  item: Item;
  onComplete: (result: AppraisalResult) => void;
}

export const AppraisalTool = ({ item, onComplete }: AppraisalToolProps) => {
  const { playerSkills, spendCash } = useGameStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AppraisalResult | null>(null);
  
  const detectionSkill = playerSkills['fake_detector'] || 0;
  const appraisalCost = Math.max(10, 50 - (detectionSkill * 5)); // Cost decreases with skill

  const handleAppraise = () => {
    if (!spendCash(appraisalCost)) {
      return; // Not enough cash
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      const appraisalResult = performAppraisal(item, detectionSkill);
      setResult(appraisalResult);
      setIsAnalyzing(false);
      onComplete(appraisalResult);
    }, 2000 + Math.random() * 1000); // 2-3 seconds
  };

  if (result) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            🔍 Değerlendirme Sonucu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-2xl mb-2">
              {result.isAuthentic ? '✅' : '❌'}
            </div>
            <div className="font-medium">
              {result.isAuthentic ? 'ORİJİNAL' : 'SAHTESİ SANSİ VAR'}
            </div>
            <Badge 
              className={`mt-1 ${
                result.confidence > 80 
                  ? 'bg-cash-green' 
                  : result.confidence > 60 
                    ? 'bg-retro-yellow text-black'
                    : 'bg-destructive'
              }`}
            >
              %{result.confidence} güven
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Tespit Edilen Özellikler:</div>
            {result.detectedFeatures.map((feature, idx) => (
              <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 bg-current rounded-full"></span>
                {feature}
              </div>
            ))}
          </div>
          
          <div className="p-2 rounded bg-muted/50">
            <div className="text-xs font-medium mb-1">Önerim:</div>
            <div className="text-xs text-muted-foreground">
              {result.recommendation === 'buy' && '💚 Satın almayı öneririm'}
              {result.recommendation === 'avoid' && '🚫 Satın almaktan kaçının'}
              {result.recommendation === 'investigate' && '🤔 Daha fazla araştırma gerekli'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 text-center">
          <div className="text-2xl mb-3">🔍</div>
          <div className="font-medium mb-2">Analiz ediliyor...</div>
          <Progress value={undefined} className="w-full" />
          <div className="text-xs text-muted-foreground mt-2">
            Ürün detayları inceleniyor
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          🔍 Ürün Değerlendirmesi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className="text-4xl mb-2">{item.image}</div>
          <div className="font-medium">{item.name}</div>
          <Badge variant="outline" className="mt-1">
            {item.category}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Orijinallik kontrolü</div>
          <div>• Malzeme analizi</div>
          <div>• Dönem uygunluğu</div>
          <div>• Değer tahmini</div>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span>Analiz Ücreti:</span>
          <Badge className="bg-retro-orange text-white">
             ${appraisalCost}
          </Badge>
        </div>
        
        {detectionSkill > 0 && (
          <div className="text-xs text-retro-cyan">
            Yetenek bonusu: +{detectionSkill * 15}% doğruluk
          </div>
        )}
        
        <Button 
          onClick={handleAppraise}
          className="w-full bg-retro-purple hover:bg-retro-purple/90"
        >
          Analiz Et (${appraisalCost})
        </Button>
      </CardContent>
    </Card>
  );
};