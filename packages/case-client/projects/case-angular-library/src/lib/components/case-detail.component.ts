import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { ResourceDefinition } from '../interfaces/resource-definition.interface'
import { BreadcrumbService } from '../services/breadcrumb.service'
import { FlashMessageService } from '../services/flash-message.service'
import { ResourceService } from '../services/resource.service'

@Component({
  template: 'NO UI TO BE FOUND HERE!'
})
export class CaseDetailComponent {
  item: any
  definition: ResourceDefinition

  constructor(
    private breadcrumbService: BreadcrumbService,
    private resourceService: ResourceService,
    private flashMessageService: FlashMessageService,
    private activatedRoute?: ActivatedRoute
  ) {}

  async initDetailView() {
    await this.getItem(this.activatedRoute.snapshot.params.id)
    this.setBreadcrumbs()
  }

  // Get remote item from API for "edit" mode.
  async getItem(id: string) {
    this.item = await this.resourceService.show(this.definition.slug, id).then(
      (itemRes) => {
        itemRes.propertiesInArray = this.getPropertiesInArray(itemRes)
        return itemRes
      },
      (error) => {
        this.flashMessageService.error(`Error while fetching data from server`)
      }
    )
  }

  getPropertiesInArray(item: any): { key: string; value: any }[] {
    return Object.keys(item).map((key) => {
      return {
        key,
        value: item[key]
      }
    })
  }

  setBreadcrumbs() {
    this.breadcrumbService.breadcrumbLinks.next([
      {
        path: `/${this.definition.path || this.definition.slug}`,
        label: this.definition.title
      },
      {
        label: this.item[this.definition.mainIdentifier]
      }
    ])
  }
}
