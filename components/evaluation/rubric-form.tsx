'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ClipboardList, Save } from 'lucide-react'
import { DEFAULT_RUBRIC_CRITERIA, SCORE_LABELS } from '@/lib/constants'
import type { RubricCriteria, RubricScore, RubricEvaluation } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RubricFormProps {
  studentName: string
  studentId: string
  sessionId: string
  tutorId: string
  criteria?: RubricCriteria[]
  onSubmit: (evaluation: Omit<RubricEvaluation, 'id' | 'createdAt'>) => void
  initialScores?: RubricScore[]
}

type ScoreValue = 'A' | 'B' | 'C' | 'D' | 'E'

export function RubricForm({
  studentName,
  studentId,
  sessionId,
  tutorId,
  criteria = DEFAULT_RUBRIC_CRITERIA,
  onSubmit,
  initialScores = []
}: RubricFormProps) {
  const [scores, setScores] = useState<Record<string, RubricScore>>(() => {
    const initial: Record<string, RubricScore> = {}
    initialScores.forEach(s => {
      initial[s.criteriaId] = s
    })
    return initial
  })
  const [overallComment, setOverallComment] = useState('')

  const handleScoreChange = (criteriaId: string, score: ScoreValue) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: {
        criteriaId,
        score,
        notes: prev[criteriaId]?.notes || ''
      }
    }))
  }

  const handleNotesChange = (criteriaId: string, notes: string) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: {
        ...prev[criteriaId],
        criteriaId,
        notes
      }
    }))
  }

  const handleSubmit = () => {
    const evaluation: Omit<RubricEvaluation, 'id' | 'createdAt'> = {
      sessionId,
      studentId,
      tutorId,
      scores: Object.values(scores),
      overallComment
    }
    onSubmit(evaluation)
  }

  const calculateTotalScore = (): number => {
    let total = 0
    let totalWeight = 0

    Object.values(scores).forEach(score => {
      const criterion = criteria.find(c => c.id === score.criteriaId)
      if (criterion && score.score) {
        const scoreValue = SCORE_LABELS[score.score].value
        total += (scoreValue / 4) * criterion.weight
        totalWeight += criterion.weight
      }
    })

    return totalWeight > 0 ? Math.round((total / totalWeight) * 100) : 0
  }

  const groupedCriteria = criteria.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {} as Record<string, RubricCriteria[]>)

  const categoryLabels = {
    kognitif: 'Kognitif (Pengetahuan)',
    afektif: 'Afektif (Sikap)',
    psikomotorik: 'Psikomotorik (Keterampilan)'
  }

  const isComplete = criteria.every(c => scores[c.id]?.score)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-primary" />
          </div>
          Rubrik Penilaian
        </CardTitle>
        <CardDescription>
          Evaluasi detail untuk {studentName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Summary */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="font-medium">Skor Total</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {calculateTotalScore()}%
          </Badge>
        </div>

        {/* Criteria by Category */}
        <Accordion type="multiple" defaultValue={['kognitif', 'afektif', 'psikomotorik']}>
          {Object.entries(groupedCriteria).map(([category, items]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-sm font-medium">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                {items.map(criterion => (
                  <div key={criterion.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <Label className="text-sm font-medium">{criterion.name}</Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {criterion.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Bobot: {criterion.weight}%
                      </Badge>
                    </div>

                    <RadioGroup
                      value={scores[criterion.id]?.score || ''}
                      onValueChange={(value) => handleScoreChange(criterion.id, value as ScoreValue)}
                      className="flex flex-wrap gap-2"
                    >
                      {(Object.entries(SCORE_LABELS) as [ScoreValue, typeof SCORE_LABELS[ScoreValue]][]).map(([grade, info]) => (
                        <div key={grade} className="flex items-center">
                          <RadioGroupItem
                            value={grade}
                            id={`${criterion.id}-${grade}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`${criterion.id}-${grade}`}
                            className={cn(
                              'px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors border',
                              'hover:bg-muted',
                              scores[criterion.id]?.score === grade
                                ? `${info.color} text-white border-transparent`
                                : 'bg-background border-input'
                            )}
                          >
                            {grade} - {info.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <Textarea
                      placeholder="Catatan (opsional)..."
                      value={scores[criterion.id]?.notes || ''}
                      onChange={(e) => handleNotesChange(criterion.id, e.target.value)}
                      className="text-sm h-16 resize-none"
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Overall Comment */}
        <div className="space-y-2">
          <Label>Komentar Keseluruhan</Label>
          <Textarea
            placeholder="Tuliskan komentar atau saran untuk siswa..."
            value={overallComment}
            onChange={(e) => setOverallComment(e.target.value)}
            className="min-h-24"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={!isComplete}
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan Evaluasi
        </Button>

        {!isComplete && (
          <p className="text-xs text-muted-foreground text-center">
            Lengkapi semua kriteria untuk menyimpan evaluasi
          </p>
        )}
      </CardContent>
    </Card>
  )
}
