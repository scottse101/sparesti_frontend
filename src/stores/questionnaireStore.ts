import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { QuestionnaireData } from '@/types/QuestionnaireData'; // Check this path!

export const useQuestionnaireStore = defineStore('questionnaireStore', {
  state: () => ({
    questionnaireData: useStorage<QuestionnaireData>('questionnaireData', {
      stepOne: {
        firstName: '',
        lastName: '',
        birthdate: '',
        occupationStatus: '',
      },
      stepTwo: {
        checkingAccount: '',
        savingsAccount: '',
      },
      stepThree: {
        annualIncome: 0,
        changeWillingness: 0,
      },
      stepFour: {
        products: [],
      },
      
    }, sessionStorage),
  }),
  getters: {
    fullData: (state): QuestionnaireData => state.questionnaireData,
    stepOneData: (state) => state.questionnaireData.stepOne,
    stepTwoData: (state) => state.questionnaireData.stepTwo,
    stepThreeData: (state) => state.questionnaireData.stepThree,
    stepFourData: (state) => state.questionnaireData.stepFour,
  },
  actions: {
    updateStepOneData(data: QuestionnaireData['stepOne']) {
      this.questionnaireData.stepOne = data;
    },
    updateStepTwoData(data: QuestionnaireData['stepTwo']) {
      this.questionnaireData.stepTwo = data;
    },
    updateStepThreeData(data: QuestionnaireData['stepThree']) {
      this.questionnaireData.stepThree = data;
    },
    updateStepFourData(data: QuestionnaireData['stepFour']) {
      this.questionnaireData.stepFour = data;
    },
    
    resetQuestionnaire() {
      this.questionnaireData = {
        stepOne: {
          firstName: '',
          lastName: '',
          birthdate: '',
          occupationStatus: '',
        },
        stepTwo: {
          checkingAccount: '',
          savingsAccount: '',
        },
        stepThree: {
          annualIncome: 0,
          changeWillingness: 0,
        },
        stepFour: {
          products: [],
        },
      };
    },
    async submitAllData() {
      const userInfo = {
        id: '', 
        userId: '', 
        displayName: `${this.questionnaireData.stepOne.firstName} ${this.questionnaireData.stepOne.lastName}`,
        firstName: this.questionnaireData.stepOne.firstName,
        lastName: this.questionnaireData.stepOne.lastName,
        dateOfBirth: this.questionnaireData.stepOne.birthdate,
        occupationStatus: this.questionnaireData.stepOne.occupationStatus.toUpperCase(),
        motivation: this.questionnaireData.stepThree.changeWillingness,
        income: this.questionnaireData.stepThree.annualIncome,
        budgetingProducts: this.questionnaireData.stepFour.products.map(product => ({
          id: '', 
          name: product.name,
          frequency: product.frequency.toUpperCase(), 
          amount: parseFloat(product.price), 
          userInfoId: 0,
        })),
        budgetingLocations: [], 
      };

      try {
        const response = await fetch('/api/user-info/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Success:', data);
        } else {
          console.error('Submission failed:', data);
        }
      } catch (error) {
        console.error('Error submitting user info:', error);
      }
    }
  },
});
