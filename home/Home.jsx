import React, { useState, useEffect } from "react"
import { Animated, Text, View, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { styles } from "../style"
import { data } from "../data/data"

const ProgressBar = ({ currentQuestionIndex, totalQuestions }) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  )
}

const Home = ({ navigation }) => {
  const [scaleAnim] = useState(new Animated.Value(0.9))

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [scaleAnim])

  const insets = useSafeAreaInsets()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [confirmationPressed, setConfirmationPressed] = useState(false)
  const [userAnsweredCorrect, setUserAnsweredCorrect] = useState(null)

  const isLastQuestion = currentQuestionIndex === data.quiz.questions.length - 1

  const handleAnswerPress = (answer) => {
    setSelectedAnswer(answer)
    setUserAnsweredCorrect(null)
    setConfirmationPressed(false)
  }

  const handleConfirmationPress = () => {
    const isCorrectAnswer =
      selectedAnswer ===
      data.quiz.questions[currentQuestionIndex].correct_answer

    setUserAnsweredCorrect(isCorrectAnswer)

    if (isCorrectAnswer) {
      if (!isLastQuestion) {
        setConfirmationPressed(true)
        setTimeout(() => {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
          setSelectedAnswer(null)
          setUserAnsweredCorrect(null)
          setConfirmationPressed(false)
        }, 1000)
      }
    }
  }

  const renderQuestion = () => {
    const question = data.quiz.questions[currentQuestionIndex]
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    return (
      <View style={styles.question}>
        <Text style={styles.hero}>{question.question}</Text>
        {question.options.map((answer, index) => {
          const optionLabel = alphabet[index]
          let buttonStyle = styles.answerButton

          if (selectedAnswer === answer) {
            if (userAnsweredCorrect === false) {
              buttonStyle = styles.incorrectAnswerButton
            } else if (confirmationPressed) {
              buttonStyle = userAnsweredCorrect
                ? styles.correctAnswerButton
                : styles.selectedAnswerButton
            } else {
              buttonStyle = styles.selectedAnswerButton
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswerPress(answer)}
              disabled={confirmationPressed && userAnsweredCorrect}
            >
              <View
                style={[
                  styles.viewAswerLetter,
                  selectedAnswer === answer && styles.selectedAnswerLetter,
                ]}
              >
                <Text style={styles.answerLetter}>{optionLabel}</Text>
              </View>
              <Text
                style={[
                  styles.answerText,
                  selectedAnswer === answer && styles.selectedAnswerText,
                ]}
              >
                {answer}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderCompletionMessage = () => {
    return (
      <View style={styles.completionContainer}>
        <Text style={styles.completionText}>
          Teste Concluído {`\n`}🥳 Parabéns 🎉
        </Text>
      </View>
    )
  }

  const renderContent = () => {
    if (isLastQuestion && userAnsweredCorrect) {
      return renderCompletionMessage()
    } else {
      return (
        <>
          {renderQuestion()}
          {!confirmationPressed && selectedAnswer && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmationPress}
            >
              <Text style={styles.confirmText}>CONFIRMAR</Text>
            </TouchableOpacity>
          )}
        </>
      )
    }
  }

  return (
    <Animated.View
      style={{
        ...styles.container,
        paddingTop: insets.top,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <ProgressBar
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={data.quiz.questions.length}
      />
      {renderContent()}
    </Animated.View>
  )
}

export default Home
