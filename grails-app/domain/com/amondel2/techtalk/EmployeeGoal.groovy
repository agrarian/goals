package com.amondel2.techtalk

import grails.rest.Resource
import groovy.transform.EqualsAndHashCode

@EqualsAndHashCode(includes=['id'])
@Resource(uri='/employeeGoal', formats=['json', 'xml'])
class EmployeeGoal implements Serializable  {

    def utilService = new Utils()
    private static final serialVersionUID = 1L

    static belongsTo = [employee:Employees]
    static hasMany = [types:EmployeeGoalType]

    static mapping = {
        id generator:'assigned'
        version false
    }

    static constraints = {
        title unique: ['employee'], nullable: false, blank: false, maxSize: 100
        description  nullable: false, blank: false
        employee nullable: false, blank: false
        targetCompletDate nullable: false, blank: false
        actualCompletedDate  nullable: true, blank: false
    }

    def beforeValidate() {
        if(!id || id.equals(null)) {
            id  = utilService.idGenerator()
        }
    }

    def beforeInsert() {
        if(!id || id.equals(null)) {
            id  = utilService.idGenerator()
            createdDate = new Date()
        }
    }

    def beforeUpdate() {
        modifiedDate = new Date()
    }

    @Override
    public String toString(){
        return this.title
    }

    String id
    Employees employee
    String description
    String title
    GoalStatus status = GoalStatus.NotStarted
    Date targetCompletDate
    Date actualCompletedDate
    Date createdDate
    Date modifiedDate
}