/******************************************************************************
* This file was generated by ZenStack CLI.
******************************************************************************/

/* eslint-disable */
// @ts-nocheck

const metadata = {
    models: {
        user: {
            name: 'User', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, clerkId: {
                    name: "clerkId",
                    type: "String",
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, name: {
                    name: "name",
                    type: "String",
                }, email: {
                    name: "email",
                    type: "String",
                }, studentCourses: {
                    name: "studentCourses",
                    type: "Course",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'student',
                }, tutorCourses: {
                    name: "tutorCourses",
                    type: "Course",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'tutor',
                }, lessons: {
                    name: "lessons",
                    type: "Lesson",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'user',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, clerkId: {
                    name: "clerkId",
                    fields: ["clerkId"]
                },
            }
            ,
        }
        ,
        language: {
            name: 'Language', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, name: {
                    name: "name",
                    type: "String",
                }, code: {
                    name: "code",
                    type: "String",
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, nativeCourses: {
                    name: "nativeCourses",
                    type: "Course",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'nativeLanguage',
                }, targetCourses: {
                    name: "targetCourses",
                    type: "Course",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'targetLanguage',
                }, nativeCatalog: {
                    name: "nativeCatalog",
                    type: "LessonCatalog",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'nativeLanguage',
                }, targetCatalog: {
                    name: "targetCatalog",
                    type: "LessonCatalog",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'targetLanguage',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, code: {
                    name: "code",
                    fields: ["code"]
                },
            }
            ,
        }
        ,
        course: {
            name: 'Course', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, nativeLanguage: {
                    name: "nativeLanguage",
                    type: "Language",
                    isDataModel: true,
                    backLink: 'nativeCourses',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "nativeLanguageId" },
                }, nativeLanguageId: {
                    name: "nativeLanguageId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'nativeLanguage',
                }, targetLanguage: {
                    name: "targetLanguage",
                    type: "Language",
                    isDataModel: true,
                    backLink: 'targetCourses',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "targetLanguageId" },
                }, targetLanguageId: {
                    name: "targetLanguageId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'targetLanguage',
                }, level: {
                    name: "level",
                    type: "String",
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, student: {
                    name: "student",
                    type: "User",
                    isDataModel: true,
                    backLink: 'studentCourses',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "studentId" },
                }, studentId: {
                    name: "studentId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'student',
                }, tutor: {
                    name: "tutor",
                    type: "User",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'tutorCourses',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "tutorId" },
                }, tutorId: {
                    name: "tutorId",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tutor',
                }, lessons: {
                    name: "lessons",
                    type: "Lesson",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'course',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        lesson: {
            name: 'Lesson', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, title: {
                    name: "title",
                    type: "String",
                }, type: {
                    name: "type",
                    type: "String",
                }, scenarioContext: {
                    name: "scenarioContext",
                    type: "String",
                }, lessonJson: {
                    name: "lessonJson",
                    type: "Json",
                    isOptional: true,
                }, audioUrl: {
                    name: "audioUrl",
                    type: "String",
                    isOptional: true,
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, course: {
                    name: "course",
                    type: "Course",
                    isDataModel: true,
                    backLink: 'lessons',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "courseId" },
                }, courseId: {
                    name: "courseId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'course',
                }, user: {
                    name: "user",
                    type: "User",
                    isDataModel: true,
                    backLink: 'lessons',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "userId" },
                }, userId: {
                    name: "userId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'user',
                }, progress: {
                    name: "progress",
                    type: "ProgressStatus",
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        lessonCatalog: {
            name: 'LessonCatalog', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, nativeLanguage: {
                    name: "nativeLanguage",
                    type: "Language",
                    isDataModel: true,
                    backLink: 'nativeCatalog',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "nativeLanguageId" },
                }, nativeLanguageId: {
                    name: "nativeLanguageId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'nativeLanguage',
                }, targetLanguage: {
                    name: "targetLanguage",
                    type: "Language",
                    isDataModel: true,
                    backLink: 'targetCatalog',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "targetLanguageId" },
                }, targetLanguageId: {
                    name: "targetLanguageId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'targetLanguage',
                }, content: {
                    name: "content",
                    type: "Json",
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
    }
    ,
    deleteCascade: {
    }
    ,
    authModel: 'User'
};
export default metadata;
