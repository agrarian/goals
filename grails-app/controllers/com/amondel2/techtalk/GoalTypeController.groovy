package com.amondel2.techtalk

import grails.plugin.springsecurity.annotation.Secured

@Secured(['ROLE_ADMIN'])
class GoalTypeController {

    static responseFormats = ['html','json', 'xml']
    static scaffold = GoalType
}
