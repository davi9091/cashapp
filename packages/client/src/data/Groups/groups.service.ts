import { BehaviorSubject } from 'rxjs'
import { IUserService, userResponseToModel } from '../user/user.service'
import { getHeaders } from '../utils'
import { CustomOpGroup, GroupResponse, OperationGroup } from './types'

const FETCH_ENDPOINTS = {
  getGroups: '/opGroups',
  addGroup: '/opGroups/new',
}

export interface IGroupsService {
  groups$: BehaviorSubject<OperationGroup[]>

  addGroup(newGroup: CustomOpGroup): Promise<OperationGroup>
}

export class GroupsService implements IGroupsService {
  #userService: IUserService

  groups$ = new BehaviorSubject<OperationGroup[]>([])

  constructor(userService: IUserService) {
    this.#userService = userService

    userService.user$.subscribe((user) => {
      if (user) {
        this.#updateGroups()
      } else {
        this.groups$.next([])
      }
    })
  }

  async #fetchGroups(): Promise<OperationGroup[]> {
    try {
      const groupsResponse = await fetch(
        FETCH_ENDPOINTS.getGroups,
        getHeaders(undefined, 'GET'),
      )

      const groups: GroupResponse[] = await groupsResponse.json()
      return groups
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async #addGroup(newGroup: CustomOpGroup): Promise<OperationGroup> {
    try {
      const response = await fetch(
        FETCH_ENDPOINTS.addGroup,
        getHeaders(newGroup, 'PUT'),
      )

      const group: CustomOpGroup = await response.json()
      return { ...group }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async #updateGroups() {
    const groups = await this.#fetchGroups()
    this.groups$.next(groups)
  }

  async addGroup(newGroup: CustomOpGroup): Promise<OperationGroup> {
    const user = this.#userService.user$.getValue()
    if (!user) throw new Error('Tried to create a group without logging in')

    const createdGroup = await this.#addGroup(newGroup)

    this.#updateGroups()

    return createdGroup
  }
}
