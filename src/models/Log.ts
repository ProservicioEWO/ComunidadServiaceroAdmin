import { UUID } from "../shared/typeAlias"
import { Module } from "./Module"
import { User } from "./User"

export enum LogType {
  module = "M",
  login = "L"
}

export interface Log {
  id: UUID
  date: string
  type: string
  module: Module
  user: User
}