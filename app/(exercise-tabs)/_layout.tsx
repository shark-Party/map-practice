import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const ExercsiseLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name='index'/>
        <Tabs.Screen name='coffee'/>
        <Tabs.Screen name='tap&Tell'/>
    </Tabs>
  )
}

export default ExercsiseLayout

const styles = StyleSheet.create({})