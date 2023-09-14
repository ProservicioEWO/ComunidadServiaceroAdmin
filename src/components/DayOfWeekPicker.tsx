import { ColorProps, Flex, HStack, Text, useBoolean } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CircleCheckboxProps {
  label: string
  value: boolean
  color: "purple.500" | "red.500"
  OnChange: (value: boolean) => void
}

const CircleCheckbox = ({ label, value, color, OnChange }: CircleCheckboxProps) => {
  const [isChecked, setIsChecked] = useBoolean(value)

  useEffect(() => {
    OnChange(isChecked)
  }, [isChecked])

  return (
    <Flex
      bg={isChecked ? color : "white"}
      borderColor={isChecked ? "white" : color}
      color={isChecked ? "white" : color}
      cursor="pointer"
      userSelect="none"
      boxSize="10"
      borderRadius="full"
      borderWidth={1}
      align="center"
      justify="center"
      onClick={setIsChecked.toggle}>
      <Text>{label}</Text>
    </Flex>
  )
}

interface DayOfWeekPickerProps {
  values?: number[]
  isInvalid?: boolean
  OnChange: (values: number[]) => void
}

const DayOfWeekPicker = ({ values, isInvalid = false, OnChange }: DayOfWeekPickerProps) => {
  const [days, setDays] = useState([
    { day: "D", selected: (values ?? []).includes(0) },
    { day: "L", selected: (values ?? []).includes(1) },
    { day: "M", selected: (values ?? []).includes(2) },
    { day: "X", selected: (values ?? []).includes(3) },
    { day: "J", selected: (values ?? []).includes(4) },
    { day: "V", selected: (values ?? []).includes(5) },
    { day: "S", selected: (values ?? []).includes(6) }
  ])

  const handleCheckChange = (isChecked: boolean, label: string) => {
    setDays((prevDays) =>
      prevDays.map(e => ({
        day: e.day,
        selected: e.day === label ? isChecked : e.selected,
      }))
    )
  }

  useEffect(() => {
    OnChange(days.map((e, i) => e.selected ? i : -1).filter(e => e !== -1))
  }, [days])

  return (
    <HStack align="center" justify="space-between">
      {
        days.map(({ day, selected }) => (
          <CircleCheckbox
            key={day}
            color={isInvalid ? "red.500" : "purple.500"}
            label={day}
            value={selected}
            OnChange={(value) => handleCheckChange(value, day)} />
        ))
      }
    </HStack>
  )
}

export default DayOfWeekPicker