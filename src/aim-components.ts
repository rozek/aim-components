/*******************************************************************************
*                                                                              *
*                Components (not only) for the AI Mentor (AIM)                 *
*                                                                              *
*******************************************************************************/

  import {
//  throwError,      // will be redefined locally because of TypeScript compiler
  quoted,
    ValueIsBoolean,
    ValueIsNumber, ValueIsNumberInRange, ValueIsFiniteNumber,
      ValueIsInteger, ValueIsIntegerInRange, ValueIsOrdinal, ValueIsCardinal,
    ValueIsString, ValueIsStringMatching, ValueIsText, ValueIsTextline,
    ValueIsListSatisfying,
    ValueIsObject, ValueIsPlainObject,
    ValueIsFunction,
    ValueIsColor, ValueIsEMailAddress, ValueIsURL,
    ValueIsOneOf,
  ValidatorForClassifier, acceptNil,rejectNil,
    expectValue,
    allowBoolean, expectBoolean,
    allowOrdinal,
    expectText, allowTextline, expectTextline,
    allowPlainObject, expectPlainObject,
    allowFunction, expectFunction,
    expectInstanceOf,
  } from 'javascript-interface-library'

  const ValueIsPhoneNumber = ValueIsTextline // *C* should be implemented

  import { render, html }                              from 'htm/preact'
  import { createContext, toChildArray, cloneElement } from 'preact'
  import { createPortal }                              from 'preact/compat'
  import { useId, useRef, useState, useEffect, useCallback, useMemo, useContext, useErrorBoundary } from 'preact/hooks'
  type VNode = any

  export {
    render, html,
    createContext, toChildArray, cloneElement,
    createPortal,
    useId, useRef, useState, useEffect, useCallback, useMemo, useContext,
      useErrorBoundary
  }

  import { useAutoAnimate } from '@formkit/auto-animate/preact'
  export { useAutoAnimate }

/**** for MarkdownView ****/

  import { Marked }          from 'marked'
  import   markedKatex       from 'marked-katex-extension'
  import { markedHighlight } from 'marked-highlight'
    import hljs from 'highlight.js/lib/core'

    import { default as _css }        from 'highlight.js/lib/languages/css'
      hljs.registerLanguage('css',_css)
    import { default as _javascript } from 'highlight.js/lib/languages/javascript'
      hljs.registerLanguage('javascript',_javascript)
    import { default as _java }       from 'highlight.js/lib/languages/java'
      hljs.registerLanguage('java',_java)
    import { default as _json }       from 'highlight.js/lib/languages/json'
      hljs.registerLanguage('json',_json)
    import { default as _typescript } from 'highlight.js/lib/languages/typescript'
      hljs.registerLanguage('typescript',_typescript)
    import { default as _xml }        from 'highlight.js/lib/languages/xml'
      hljs.registerLanguage('html',_xml)
      hljs.registerLanguage('xml', _xml)
  export { Marked }

/**** make some existing types indexable ****/

  interface Indexable { [Key:string|number|symbol]:any }

/**** generic constructor for asynchronous functions ****/

  export const AsyncFunction = (async () => {}).constructor

//------------------------------------------------------------------------------
//--                             Type Definitions                             --
//------------------------------------------------------------------------------

  export type AIM_Name         = string       // mainly for illustrative reasons
  export type AIM_Path         = string                                  // dto.
  export type AIM_Identifier   = string                                  // dto.
  export type AIM_AttrName     = string                                  // dto.
  export type AIM_Selector     = string                                  // dto.
  export type AIM_Ordinal      = number                                  // dto.
  export type AIM_Cardinal     = number                                  // dto.
  export type AIM_Text         = string                                  // dto.
  export type AIM_Textline     = string                                  // dto.
  export type AIM_Color        = string                                  // dto.
  export type AIM_EMailAddress = string                                  // dto.
  export type AIM_PhoneNumber  = string                                  // dto.
  export type AIM_URL          = string                                  // dto.

  export type AIM_Renderer = (PropSet:Indexable) => any

/**** geometry-related types ****/

  export type AIM_Location  = number                                     // dto.
  export type AIM_Dimension = number                                     // dto.

  export type AIM_Position = { x:AIM_Location,y:AIM_Location }
  export type AIM_Size     = { Width:AIM_Dimension,Height:AIM_Dimension }

  export type AIM_Geometry = {
    x:AIM_Location,y:AIM_Location, Width:AIM_Dimension,Height:AIM_Dimension
  }

//------------------------------------------------------------------------------
//--                             internal Symbols                             --
//------------------------------------------------------------------------------

  const $normalizedName = Symbol('normalizedName')

/**** AssetsBase, IconFolder ****/

  const AssetsBase:AIM_URL = '/' // 'https://rozek.github.io/aim-components/'
  const IconFolder:AIM_URL = AssetsBase + 'icons/'

/**** special Values ****/

  export const AIM_empty          = { Placeholder:'(empty)',           disabled:false }
  export const AIM_noSelection    = { Placeholder:'(no Selection)',    disabled:true }
  export const AIM_multipleValues = { Placeholder:'(multiple Values)', disabled:false }

/**** ValueIsSpecial ****/

  export function ValueIsSpecial (Value:any):boolean {
    return (
      (Value === AIM_empty) || (Value === AIM_noSelection) ||
      (Value === AIM_multipleValues)
    )
  }

/**** throwError - simplifies construction of named errors ****/

  export function throwError (Message:string):never {
debugger
    let Match = /^([$a-zA-Z][$a-zA-Z0-9]*):\s*(\S.+)\s*$/.exec(Message)
    if (Match == null) {
      throw new Error(Message)
    } else {
      let namedError = new Error(Match[2])
        namedError.name = Match[1]
      throw namedError
    }
  }

/**** throwReadOnlyError ****/

// @ts-ignore TS2534 why is TS complaining here?
  export function throwReadOnlyError (Name:string):never {
    throwError(
      'ReadOnlyProperty: property ' + quoted(Name) + ' must not be set'
    )
  }

//------------------------------------------------------------------------------
//--                 Classification and Validation Functions                  --
//------------------------------------------------------------------------------

/**** ValueIsName (non-empty, only non-ctrl char.s, neither "/" nor ":") ****/

  const AIM_NamePattern = /^(?=.*\S)[^\u0000-\u001F\/:]+$/

  export function ValueIsName (Value:any):boolean {
    return (
      ValueIsStringMatching(Value,AIM_NamePattern) &&
      ! /^#\d+/.test(Value)
    )
  }

/**** allow/expect[ed]Name ****/

  export const allowName = ValidatorForClassifier(
    ValueIsName, acceptNil, 'AIM name'
  ), allowedName = allowName

  export const expectName = ValidatorForClassifier(
    ValueIsName, rejectNil, 'AIM name'
  ), expectedName = expectName

/**** ValueIsPath - "/"-separated sequence of AIM_Names, opt. leading "/" ****/

  const AIM_PathPattern = /^\/?(?:(?=.*\S)[^\u0000-\u001F\/:]+)(?:\/(?=.*\S)[^\u0000-\u001F\/:]+)*$/

  export function ValueIsPath (Value:any):boolean {
    return ValueIsStringMatching(Value,AIM_PathPattern)
  }

/**** allow/expect[ed]Path ****/

  export const allowPath = ValidatorForClassifier(
    ValueIsPath, acceptNil, 'AIM name path'
  ), allowedPath = allowPath

  export const expectPath = ValidatorForClassifier(
    ValueIsPath, rejectNil, 'AIM name path'
  ), expectedPath = expectPath

/**** ValueIsLocation ****/

  export function ValueIsLocation (Value:any):boolean {
    return ValueIsFiniteNumber(Value)
  }

/**** allow/expect[ed]Location ****/

  export const allowLocation = ValidatorForClassifier(
    ValueIsLocation, acceptNil, 'AIM coordinate'
  ), allowedLocation = allowLocation

  export const expectLocation = ValidatorForClassifier(
    ValueIsLocation, rejectNil, 'AIM coordinate'
  ), expectedLocation = expectLocation

/**** ValueIsDimension ****/

  export function ValueIsDimension (Value:any):boolean {
    return ValueIsFiniteNumber(Value) && (Value >= 0)
  }

/**** allow/expect[ed]Dimension ****/

  export const allowDimension = ValidatorForClassifier(
    ValueIsDimension, acceptNil, 'AIM dimension'
  ), allowedDimension = allowDimension

  export const expectDimension = ValidatorForClassifier(
    ValueIsDimension, rejectNil, 'AIM dimension'
  ), expectedDimension = expectDimension

/**** ValueIsPosition ****/

  export function ValueIsPosition (Value:any):boolean {
    return ValueIsPlainObject(Value) && (
      ValueIsLocation(Value.x) && ValueIsLocation(Value.y)
    )
  }

/**** allow/expect[ed]Position ****/

  export const allowPosition = ValidatorForClassifier(
    ValueIsPosition, acceptNil, 'AIM position'
  ), allowedPosition = allowPosition

  export const expectPosition = ValidatorForClassifier(
    ValueIsPosition, rejectNil, 'AIM position'
  ), expectedPosition = expectPosition

/**** ValueIsSize ****/

  export function ValueIsSize (Value:any):boolean {
    return ValueIsPlainObject(Value) && (
      ValueIsDimension(Value.Width) && ValueIsDimension(Value.Height)
    )
  }

/**** allow/expect[ed]Size ****/

  export const allowSize = ValidatorForClassifier(
    ValueIsSize, acceptNil, 'AIM size'
  ), allowedSize = allowSize

  export const expectSize = ValidatorForClassifier(
    ValueIsSize, rejectNil, 'AIM size'
  ), expectedSize = expectSize

/**** ValueIsGeometry ****/

  export function ValueIsGeometry (Value:any):boolean {
    return ValueIsPlainObject(Value) && (
      ValueIsLocation(Value.x) && ValueIsDimension(Value.Width) &&
      ValueIsLocation(Value.y) && ValueIsDimension(Value.Height)
    )
  }

/**** allow/expect[ed]Geometry ****/

  export const allowGeometry = ValidatorForClassifier(
    ValueIsGeometry, acceptNil, 'AIM geometry'
  ), allowedGeometry = allowGeometry

  export const expectGeometry = ValidatorForClassifier(
    ValueIsGeometry, rejectNil, 'AIM geometry'
  ), expectedGeometry = expectGeometry

/**** ValueIsMIMEType ****/

  const MIMEPattern = /^[a-z0-9]+([._+-][a-z0-9]+)*\/[a-z0-9]+([._+-][a-z0-9]+)*(\s*;\s*[a-z0-9-]+=[a-z0-9.+-]+)*$/i

  export function ValueIsMIMEType (Value:any):boolean {
    return ValueIsStringMatching(Value,MIMEPattern)
  }

/**** ValueIsTextFormat ****/

  export const AIM_supportedTextFormats = [
    'application/javascript', 'application/typescript', 'application/json',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html', 'text/markdown', 'text/plain'
  ]

  export function ValueIsTextFormat (Value:any):boolean {
    return ValueIsOneOf(Value,AIM_supportedTextFormats)
  }

/**** ValueIsHTMLFormat ****/

  export const AIM_supportedHTMLFormats = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html', 'text/markdown', 'text/plain'
  ]

  export function ValueIsHTMLFormat (Value:any):boolean {
    return ValueIsOneOf(Value,AIM_supportedHTMLFormats)
  }

/**** ValueIsMarkdownFormat ****/

  export const AIM_supportedMarkdownFormats = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown', 'text/plain'
  ]

  export function ValueIsMarkdownFormat (Value:any):boolean {
    return ValueIsOneOf(Value,AIM_supportedMarkdownFormats)
  }

/**** ValueIsImageFormat ****/

  export const AIM_supportedImageFormats = [
    'image/apng', 'image/avif', 'image/bmp', 'image/gif', 'image/jpeg',
    'image/png', 'image/svg+xml', 'image/webp'
  ]

  export function ValueIsImageFormat (Value:any):boolean {
    return ValueIsOneOf(Value,AIM_supportedImageFormats)
  }

/**** ValueIsIdentifier ****/

  const AIM_IdentifierPattern = /^[a-z$_][a-z$_0-9]*$/i

  export function ValueIsIdentifier (Value:any):boolean {
    return ValueIsStringMatching(Value, AIM_IdentifierPattern)
  }

/**** allow/expect[ed]Identifier ****/

  export const allowIdentifier = ValidatorForClassifier(
    ValueIsIdentifier, acceptNil, 'AIM identifier'
  ), allowedIdentifier = allowIdentifier

  export const expectIdentifier = ValidatorForClassifier(
    ValueIsIdentifier, rejectNil, 'AIM identifier'
  ), expectedIdentifier = expectIdentifier

/**** ValueIsIndexPath ****/

  export function ValueIsIndexPath (Value:any):boolean {
    return ValueIsListSatisfying(Value,ValueIsOrdinal)
  }

/**** ValueIsVNode (not very specific yet) ****/

  function ValueIsVNode (Value:any):boolean {
    return (Value != null) && (Value.constructor === undefined)
  }

/**** ValueIsRef ****/

  function ValueIsRef (Value:any):boolean {
    return ValueIsPlainObject(Value) && ('current' in Value)
  }

/**** ValueIsPromise ****/

  function ValueIsPromise (Value:any):boolean {
    return (
      (ValueIsObject(Value) || ValueIsFunction(Value)) &&
      ValueIsFunction(Value.then)
    )
  }

//------------------------------------------------------------------------------
//--                             PropSet Parsing                              --
//------------------------------------------------------------------------------

/**** parsedPropSet ****/

  export function parsedPropSet (
    PropSet:Indexable, ...ParserList:Function[]
  ):any[] {
    expectPlainObject('PropSet',PropSet)

    ParserList.forEach((Parser:any, Index:number) => {
      if (! ValueIsFunction(Parser)) throwError(
        `InvalidArgument: PropSet parser argument #${Index+1} is not a function`
      )
    })

    const Result:any[] = [], Error:any = undefined
      const normalizedPropSet:Indexable = {}
        Array.from(Object.keys(PropSet)).forEach((Key:string) => {
          let normalizedKey = Key.replace(/[-_]/g,'').trim().toLowerCase()
          normalizedPropSet[normalizedKey] = PropSet[Key]
        })
      const ContentList = normalizedPropSet.children
      delete normalizedPropSet.children
      delete normalizedPropSet['aim:rendercount']

        ParserList.forEach(
          (Parser:Function) => Result.push(Parser(normalizedPropSet))
        )

      Result.push(normalizedPropSet, ContentList)
    return Result
  }

/**** parsedProp ****/

  export function parsedProp (PropSet:Indexable, Parser:Function):any {
    expectPlainObject    ('PropSet',PropSet)
    expectFunction('PropSet parser',Parser)

    const normalizedPropSet:Indexable = {}
      Array.from(Object.keys(PropSet)).forEach((Key:string) => {
        let normalizedKey = Key.replace(/[-_]/g,'').trim().toLowerCase()
        normalizedPropSet[normalizedKey] = PropSet[Key]
      })
    delete normalizedPropSet.children

    return Parser(normalizedPropSet)
  }

/**** optionalAttribute ****/

  export function optionalAttribute (
    PropSet:Indexable, PropName:AIM_AttrName, Validator:Function,
    PropSetName?:AIM_Textline
  ):any|undefined {
    expectPlainObject        ('PropSet',PropSet)
//  expectAttrName    ('attribute name',PropName) // *C* to be implemented
    expectFunction('validator function',Validator)
    allowTextline       ('PropSet name',PropSetName)

    const Value = PropSet[PropName]
    if (Value == null) { return undefined }

    if (Validator(Value) == true) {
      delete PropSet[PropName]
      return Value
    } else {
      throwError(
        (PropSetName == null ? '' : PropSetName + ' ') +
        'attribute ' + quoted(PropName) + ' is invalid'
      )
    }
  }

/**** mandatoryAttribute ****/

  export function mandatoryAttribute (
    PropSet:Indexable, PropName:AIM_AttrName, Validator:Function,
    PropSetName?:AIM_Textline
  ):any {
    expectPlainObject        ('PropSet',PropSet)
//  expectAttrName    ('attribute name',PropName) // *C* to be implemented
    expectFunction('validator function',Validator)
    allowTextline       ('PropSet name',PropSetName)

    const Value = PropSet[PropName]
    if (Value == null) throwError(
      'attribute ' + quoted(PropName) + ' is missing'
    )

    if (Validator(Value) == true) {
      delete PropSet[PropName]
      return Value
    } else {
      throwError(
        (PropSetName == null ? '' : PropSetName + ' ') +
        'attribute ' + quoted(PropName) + ' is invalid'
      )
    }
  }

/**** optional/mandatoryValue ****/

  export function optionalValue (PropName:AIM_AttrName, Validator:Function):(PropSet:any) => any|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,Validator)
  }

  export function mandatoryValue (PropName:AIM_AttrName, Validator:Function):(PropSet:any) => any {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,Validator)
  }

/**** optional/mandatoryBoolean ****/

  export function optionalBoolean (PropName:AIM_AttrName):(PropSet:any) => boolean|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsBoolean)
  }

  export function mandatoryBoolean (PropName:AIM_AttrName):(PropSet:any) => boolean {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsBoolean)
  }

/**** optional/mandatoryNumber ****/

  export function optionalNumber (PropName:AIM_AttrName):(PropSet:any) => number|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsNumber)
  }

  export function mandatoryNumber (PropName:AIM_AttrName):(PropSet:any) => number {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsNumber)
  }

/**** optional/mandatoryNumberInRange ****/

  export function optionalNumberInRange (
    PropName:AIM_AttrName, Minimum?:number, Maximum?:number,
    withMinimum?:boolean, withMaximum?:boolean
  ):(PropSet:any) => number|undefined {
    return (PropSet:any) => optionalAttribute(
      PropSet,PropName,
      (Value:any) => ValueIsNumberInRange(Value,Minimum,Maximum,withMinimum,withMaximum)
    )
  }

  export function mandatoryNumberInRange (
    PropName:AIM_AttrName, Minimum?:number, Maximum?:number,
    withMinimum?:boolean, withMaximum?:boolean
  ):(PropSet:any) => number {
    return (PropSet:any) => mandatoryAttribute(
      PropSet,PropName,
      (Value:any) => ValueIsNumberInRange(Value,Minimum,Maximum,withMinimum,withMaximum)
    )
  }

/**** optional/mandatoryInteger ****/

  export function optionalInteger (PropName:AIM_AttrName):(PropSet:any) => number|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsInteger)
  }

  export function mandatoryInteger (PropName:AIM_AttrName):(PropSet:any) => number {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsInteger)
  }

/**** optional/mandatoryIntegerInRange ****/

  export function optionalIntegerInRange (
    PropName:AIM_AttrName, Minimum?:number, Maximum?:number
  ):(PropSet:any) => number|undefined {
    return (PropSet:any) => optionalAttribute(
      PropSet,PropName,(Value:any) => ValueIsIntegerInRange(Value,Minimum,Maximum)
    )
  }

  export function mandatoryIntegerInRange (
    PropName:AIM_AttrName, Minimum?:number, Maximum?:number
  ):(PropSet:any) => number {
    return (PropSet:any) => mandatoryAttribute(
      PropSet,PropName,(Value:any) => ValueIsIntegerInRange(Value,Minimum,Maximum)
    )
  }

/**** optional/mandatoryOrdinal ****/

  export function optionalOrdinal (PropName:AIM_AttrName):(PropSet:any) => number|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsOrdinal)
  }

  export function mandatoryOrdinal (PropName:AIM_AttrName):(PropSet:any) => number|undefined {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsOrdinal)
  }

/**** optional/mandatoryCardinal ****/

  export function optionalCardinal (PropName:AIM_AttrName):(PropSet:any) => number|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsCardinal)
  }

  export function mandatoryCardinal (PropName:AIM_AttrName):(PropSet:any) => number|undefined {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsCardinal)
  }

/**** optional/mandatoryString ****/

  export function optionalString (PropName:AIM_AttrName):(PropSet:any) => string|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsString)
  }

  export function mandatoryString (PropName:AIM_AttrName):(PropSet:any) => string {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsString)
  }

/**** optional/mandatoryStringMatching ****/

  export function optionalStringMatching (
    PropName:AIM_AttrName, Pattern:RegExp
  ):(PropSet:any) => string|undefined {
    return (PropSet:any) => optionalAttribute(
      PropSet,PropName,(Value:any) => ValueIsStringMatching(Value,Pattern)
    )
  }

  export function mandatoryStringMatching (
    PropName:AIM_AttrName, Pattern:RegExp
  ):(PropSet:any) => string {
    return (PropSet:any) => mandatoryAttribute(
      PropSet,PropName,(Value:any) => ValueIsStringMatching(Value,Pattern)
    )
  }

/**** optional/mandatoryText ****/

  export function optionalText (PropName:AIM_AttrName):(PropSet:any) => string|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsText)
  }

  export function mandatoryText (PropName:AIM_AttrName):(PropSet:any) => string {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsText)
  }

/**** optional/mandatoryTextline ****/

  export function optionalTextline (PropName:AIM_AttrName):(PropSet:any) => string|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsTextline)
  }

  export function mandatoryTextline (PropName:AIM_AttrName):(PropSet:any) => string {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsTextline)
  }

/**** optional/mandatoryFunction ****/

  export function optionalFunction (PropName:AIM_AttrName):(PropSet:any) => Function|undefined {
    return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsFunction)
  }

  export function mandatoryFunction (PropName:AIM_AttrName):(PropSet:any) => Function {
    return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsFunction)
  }

  /**** optional/mandatoryColor ****/

    export function optionalColor (PropName:AIM_AttrName):(PropSet:any) => AIM_Color|undefined {
      return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsColor)
    }

    export function mandatoryColor (PropName:AIM_AttrName):(PropSet:any) => AIM_Color {
      return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsColor)
    }

  /**** optional/mandatoryEMailAddress ****/

    export function optionalEMailAddress (PropName:AIM_AttrName):(PropSet:any) => AIM_EMailAddress|undefined {
      return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsEMailAddress)
    }

    export function mandatoryEMailAddress (PropName:AIM_AttrName):(PropSet:any) => AIM_EMailAddress {
      return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsEMailAddress)
    }

  /**** optional/mandatoryPhoneNumber ****/

    export function optionalPhoneNumber (PropName:AIM_AttrName):(PropSet:any) => AIM_PhoneNumber|undefined {
      return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsPhoneNumber)
    }

    export function mandatoryPhoneNumber (PropName:AIM_AttrName):(PropSet:any) => AIM_PhoneNumber {
      return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsPhoneNumber)
    }

  /**** optional/mandatoryURL ****/

    export function optionalURL (PropName:AIM_AttrName):(PropSet:any) => AIM_URL|undefined {
      return (PropSet:any) => optionalAttribute(PropSet,PropName,ValueIsURL)
    }

    export function mandatoryURL (PropName:AIM_AttrName):(PropSet:any) => AIM_URL {
      return (PropSet:any) => mandatoryAttribute(PropSet,PropName,ValueIsURL)
    }

  /**** optional/mandatoryName ****/

    export function optionalName (PropName:AIM_AttrName):(PropSet:any) => Function|undefined {
      return (PropSet:any) => optionalAttribute(
        PropSet,PropName,
        (Value:any) => ValueIsName(Value)
      )
    }

    export function mandatoryName (PropName:AIM_AttrName):(PropSet:any) => Function {
      return (PropSet:any) => mandatoryAttribute(
        PropSet,PropName,
        (Value:any) => ValueIsName(Value)
      )
    }

  /**** optional/mandatoryNameOrIndex ****/

    export function optionalNameOrIndex (PropName:AIM_AttrName):(PropSet:any) => Function|undefined {
      return (PropSet:any) => optionalAttribute(
        PropSet,PropName,
        (Value:any) => ValueIsName(Value) || ValueIsOrdinal(Value)
      )
    }

    export function mandatoryNameOrIndex (PropName:AIM_AttrName):(PropSet:any) => Function {
      return (PropSet:any) => mandatoryAttribute(
        PropSet,PropName,
        (Value:any) => ValueIsName(Value) || ValueIsOrdinal(Value)
      )
    }

  /**** optional/mandatoryPath ****/

    export function optionalPath (PropName:AIM_AttrName):(PropSet:any) => Function|undefined {
      return (PropSet:any) => optionalAttribute(
        PropSet,PropName,
        (Value:any) => ValueIsPath(Value)
      )
    }

    export function mandatoryPath (PropName:AIM_AttrName):(PropSet:any) => Function {
      return (PropSet:any) => mandatoryAttribute(
        PropSet,PropName,
        (Value:any) => ValueIsPath(Value)
      )
    }

//------------------------------------------------------------------------------
//--                                  Hooks                                   --
//------------------------------------------------------------------------------

/**** useOnlineStatus ****/

  export function useOnlineStatus ():boolean {
    const [ isOnline, setIsOnline ] = useState(navigator.onLine)

    useEffect(() => {
      const handleOnline  = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline',handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline',handleOffline)
      }
    }, [])

    return isOnline
  }

/**** useWindowSize ****/

  export function useWindowSize ():{ Width:number,Height:number } {
    const [ Size, setSize ] = useState({
      Width: window.innerWidth,
      Height:window.innerHeight
    })

    useEffect(() => {
      const handleResize = () => setSize({
        Width: window.innerWidth,
        Height:window.innerHeight
      })
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return Size
  }

/**** useRerenderer ****/

  export function useRerenderer ():Function {
    const [ State,setState ] = useState({})

    function rerender () {
      setState({})
    }

    return rerender
  }

/**** useConfiguration (Configuration is an object of objects) ****/

  export function useConfiguration (
    initialConfiguration:Indexable|Function = {}
  ):[Indexable,Function] {
    if (
      ! ValueIsFunction(initialConfiguration) &&
      ! ValueIsPlainObject(initialConfiguration)
    ) throwError(
      'InvalidArgument:the given initial configuration is neither a plain ' +
      'object nor a function'
    )

    const ConfigurationRef = useRef()
    if (ConfigurationRef.current == null) {
      if (ValueIsFunction(initialConfiguration)) {
        initialConfiguration = executedCallback(
          'component callback "initialConfiguration"', initialConfiguration as Function
        )

        if (! ValueIsPlainObject(initialConfiguration)) throwError(
          'InvalidArgument:the result of the initial configuration callback is ' +
          'not a plain object'
        )
      }

      ConfigurationRef.current = deepCopyOf(initialConfiguration)
    }

  /**** "configure" merges two levels deep ****/

    const configure = useCallback((ChangeSet:Indexable) => {
      allowPlainObject('configuration change set',ChangeSet)
      if (ChangeSet == null) { return }

      for (const [ Key,Value ] of Object.entries(ChangeSet)) {
        if (Value === undefined) {
          delete ChangeSet[Key]
        } else {
          if (ValueIsPlainObject(Value)) {
            if (ValueIsPlainObject(ConfigurationRef.current[Key])) {
              Object.assign(ConfigurationRef.current[Key],Value)
            } else {
              ConfigurationRef.current[Key] = { ...Value }
            }
          } else {
            throwError(
              'InvalidArgument: configuration[' + quoted(Key) + '] is no ' +
              'plain JavaScript onject'
            )
          }
        }
      }
    },[ initialConfiguration ])

    return [ ConfigurationRef.current,configure ]
  }

/**** useDragging ****/

/* Usage:
  const handlePointerDown = useDragging({
    ViewRef:..., Container:..., onlyFrom:..., neverFrom:...,
    onDragStart:       (dx,dy, x,y, Event) => console.log('Start:', dx,dy, x,y),
    onDragContinuation:(dx,dy, x,y, Event) => console.log('Move :', dx,dy, x,y),
    onDragFinish:      (dx,dy, x,y, Event) => console.log('End  :', dx,dy, x,y),
    onDragCancellation:(dx,dy, x,y, Event) => console.log('Cancel:',dx,dy, x,y),
  })

  html`<... onPointerDown=${handlePointerDown} .../>`
*/

  export type AIM_DragHandler = (dx:number,dy:number, x:number,y:number, Event:PointerEvent) => void

  export function useDragging ({
    ViewRef, Container, onlyFrom, neverFrom,
    onDragStart, onDragContinuation, onDragFinish, onDragCancellation
  }:{
    ViewRef:any,
    Container?:AIM_Selector|HTMLElement|Function,
    onlyFrom?: AIM_Selector|HTMLElement,
    neverFrom?:AIM_Selector|HTMLElement,
    onDragStart?:       AIM_DragHandler,
    onDragContinuation?:AIM_DragHandler,
    onDragFinish?:      AIM_DragHandler,
    onDragCancellation?:AIM_DragHandler,
  }):Function {                           // returns handler for "onPointerDown"
    expectValue('preact component reference',ViewRef)
    if ((Container != null) && ! ValueIsTextline(Container) && ! (Container instanceof HTMLElement) && ! ValueIsFunction(Container)) throwError(
      'InvalidArgument: "Container" is neither a CSS selector nor an HTML element or a function'
    )
    if ((onlyFrom != null) && ! ValueIsTextline(onlyFrom) && ! (onlyFrom instanceof HTMLElement)) throwError(
      'InvalidArgument: "onlyFrom" is neither a CSS selector nor an HTML element'
    )
    if ((neverFrom != null) && ! ValueIsTextline(neverFrom) && ! (neverFrom instanceof HTMLElement)) throwError(
      'InvalidArgument: "neverFrom" is neither a CSS selector nor an HTML element'
    )
    allowFunction       ('"onDragStart" callback',onDragStart)
    allowFunction('"onDragContinuation" callback',onDragContinuation)
    allowFunction      ('"onDragFinish" callback',onDragFinish)
    allowFunction('"onDragCancellation" callback',onDragCancellation)

    const RecognizerMayDrag = (
      (onDragStart  != null) && (onDragContinuation != null) &&
      (onDragFinish != null) && (onDragCancellation != null)
    )

  /**** initialize recognition ****/

    let ContainerElement:HTMLElement|undefined // will be set in "onPointerDown"

    const StartPosition = useRef<{ x:number; y:number } | undefined>()
    const isDragging    = useRef<boolean>(false)

  /**** onPointerDown ****/

    const onPointerDown = (Event:PointerEvent) => {
      if ((ViewRef.current == null) || ! (Event.target instanceof HTMLElement)) { return }

      if ((Event.pointerType === 'mouse') && (Event.buttons !== 1)) { return }
      if ((Event.pointerType === 'touch') && ! Event.isPrimary)     { return }
      if ((Event.pointerType === 'pen')   && (Event.buttons !== 1)) { return }

      if (! RecognizerMayDrag) { return }

      switch (true) {
        case Container == null:
          ContainerElement = ViewRef.current.parentElement as HTMLElement
          break
        case ValueIsTextline(Container):
          ContainerElement = ViewRef.current.parentElement.closest(Container as string) as HTMLElement
          break
        case ValueIsFunction(Container):
          ContainerElement = (Container as Function)() as HTMLElement
          if (! (ContainerElement instanceof HTMLElement)) { ContainerElement = undefined }
          break
        default:
          ContainerElement = Container as HTMLElement
      }
      if (ContainerElement == null) { return }

      if ((onlyFrom  != null) && ! matchesSelector(Event.target,onlyFrom))  { return }
      if ((neverFrom != null) &&   matchesSelector(Event.target,neverFrom)) { return }

      window.addEventListener('pointermove',  onPointerMove)
      window.addEventListener('pointerup',    onPointerUp)
      window.addEventListener('pointercancel',onPointerCancel)

      ViewRef.current.setPointerCapture?.(Event.pointerId)

      const ContainerBox = ContainerElement.getBoundingClientRect()

      const StartX = Event.clientX - ContainerBox.left + ContainerElement.scrollLeft
      const StartY = Event.clientY - ContainerBox.top  + ContainerElement.scrollTop

      StartPosition.current = { x:StartX, y:StartY }
      isDragging.current    = true

      onDragStart?.(0,0, StartX,StartY, Event)
    }

  /**** onPointerMove ****/

    const onPointerMove = (Event:PointerEvent) => {
      if (isDragging.current === false) { return }

      if (ContainerElement == null) { return }
      onDragContinuation?.apply(null,CallbackArguments(ContainerElement,Event))
    }

  /**** finishDragging ****/

    const finishDragging = (Event:PointerEvent, cancelled:boolean) => {
      if (isDragging.current === false) { return }

      isDragging.current = false

      window.removeEventListener('pointermove',  onPointerMove)
      window.removeEventListener('pointerup',    onPointerUp)
      window.removeEventListener('pointercancel',onPointerCancel)

      if (cancelled) {
        onDragContinuation?.(0,0, StartPosition.current.x,StartPosition.current.y, Event)
        return
      }

      if ((ContainerElement != null) && RecognizerMayDrag) {
        onDragFinish?.apply(null,CallbackArguments(ContainerElement,Event))
      }
    }

  /**** onPointerUp ****/

    const onPointerUp = (Event:PointerEvent) => {
      finishDragging(Event,false)
    }

  /**** onPointerCancel ****/

    const onPointerCancel = (Event:PointerEvent) => {
      finishDragging(Event,true)
    }

  /**** CallbackArguments ****/

    const CallbackArguments = (
      Container:HTMLElement, Event:PointerEvent
    ):[ dx:number,dy:number, x:number,y:number, Event:PointerEvent ] => {
      const ContainerBox = Container.getBoundingClientRect()

      const x = Event.clientX - ContainerBox.left + Container.scrollLeft
      const y = Event.clientY - ContainerBox.top  + Container.scrollTop

      const dx = x - StartPosition.current.x
      const dy = y - StartPosition.current.y

      return [dx,dy, x,y, Event]
    }

  /**** matchesSelector ****/

    function matchesSelector (
      Element:HTMLElement, Selector:AIM_Selector|HTMLElement|undefined
    ):boolean {
      switch (true) {
        case (Selector == null):             return true
        case (typeof Selector === 'string'): return Element.matches(Selector)
        default:                             return Element === Selector
      }
    }

    return onPointerDown
  }

/**** useClickDragging ****/

/* Usage:
  const handlePointerDown = useClickDragging({
    ViewRef:..., Container:..., onlyFrom:..., neverFrom:...,
    useClickDragging:..., MultiClickLimit:..., MultiClickTimeSpan:...,
    onClick:           (ClickCount, dx,dy, x,y, Event) => console.log('Click:',      ClickCount, dx,dy, x,y),
    onDragStart:       (dx,dy, x,y, Event) => console.log('Start:', dx,dy, x,y),
    onDragContinuation:(dx,dy, x,y, Event) => console.log('Move :', dx,dy, x,y),
    onDragFinish:      (dx,dy, x,y, Event) => console.log('End  :', dx,dy, x,y),
    onDragCancellation:(dx,dy, x,y, Event) => console.log('Cancel:',dx,dy, x,y),
  })

  html`<... onPointerDown=${handlePointerDown} .../>`
*/

//export type AIM_DragHandler  = (dx:number,dy:number, x:number,y:number, Event:PointerEvent) => void
  export type AIM_ClickHandler = (ClickCount:number, dx:number,dy:number, x:number,y:number, Event:PointerEvent) => void

  export function useClickDragging ({
    ViewRef, Container, onlyFrom, neverFrom,
    ClickRadius, MultiClickLimit, MultiClickTimeSpan, onClick,
    onDragStart, onDragContinuation, onDragFinish, onDragCancellation
  }:{
    ViewRef:any,
    Container?:AIM_Selector|HTMLElement|Function,
    onlyFrom?: AIM_Selector|HTMLElement,
    neverFrom?:AIM_Selector|HTMLElement,
    ClickRadius?:       AIM_Ordinal,
    MultiClickLimit?:   AIM_Ordinal,
    MultiClickTimeSpan?:AIM_Ordinal,
    onClick?:           AIM_ClickHandler,
    onDragStart?:       AIM_DragHandler,
    onDragContinuation?:AIM_DragHandler,
    onDragFinish?:      AIM_DragHandler,
    onDragCancellation?:AIM_DragHandler,
  }):Function {                           // returns handler for "onPointerDown"
    expectValue('preact component reference',ViewRef)
    if ((Container != null) && ! ValueIsTextline(Container) && ! (Container instanceof HTMLElement) && ! ValueIsFunction(Container)) throwError(
      'InvalidArgument: "Container" is neither a CSS selector nor an HTML element or a function'
    )
    if ((onlyFrom != null) && ! ValueIsTextline(onlyFrom) && ! (onlyFrom instanceof HTMLElement)) throwError(
      'InvalidArgument: "onlyFrom" is neither a CSS selector nor an HTML element'
    )
    if ((neverFrom != null) && ! ValueIsTextline(neverFrom) && ! (neverFrom instanceof HTMLElement)) throwError(
      'InvalidArgument: "neverFrom" is neither a CSS selector nor an HTML element'
    )
    allowOrdinal                  ('click radius',ClickRadius)
    allowOrdinal             ('multi-click limit',MultiClickLimit)
    allowOrdinal          ('multi-click timespan',MultiClickTimeSpan)
    allowFunction           ('"onClick" callback',onClick)
    allowFunction       ('"onDragStart" callback',onDragStart)
    allowFunction('"onDragContinuation" callback',onDragContinuation)
    allowFunction      ('"onDragFinish" callback',onDragFinish)
    allowFunction('"onDragCancellation" callback',onDragCancellation)

  /**** detect configured features and apply defaults ****/

    if (ClickRadius        == null) { ClickRadius        = 4 }
    if (MultiClickTimeSpan == null) { MultiClickTimeSpan = 300 }

    if (MultiClickLimit == null) {
      MultiClickLimit = (onClick == null ? 0 : 1)
    }

    const RecognizerMayClick = (MultiClickLimit > 0) && (onClick != null)

    const RecognizerMayDrag = (
      (onDragStart  != null) && (onDragContinuation != null) &&
      (onDragFinish != null) // (onDragCancellation != null)
    )

  /**** initialize recognition ****/

    let ContainerElement:HTMLElement|undefined // will be set in "onPointerDown"

    const StartPosition = useRef<{ x:number; y:number } | undefined>()
    const isDragging    = useRef<boolean>(false)
    const lastClick     = useRef<{ Count:number; Time:number }>({ Count:0,Time:0 })

  /**** onPointerDown ****/

    const onPointerDown = (Event:PointerEvent) => {
      if ((ViewRef.current == null) || ! (Event.target instanceof HTMLElement)) { return }

      if (! RecognizerMayClick && ! RecognizerMayDrag) { return }

      switch (true) {
        case Container == null:
          ContainerElement = ViewRef.current.parentElement as HTMLElement
          break
        case ValueIsTextline(Container):
          ContainerElement = ViewRef.current.parentElement.closest(Container as string) as HTMLElement
          break
        case ValueIsFunction(Container):
          ContainerElement = (Container as Function)() as HTMLElement
          if (! (ContainerElement instanceof HTMLElement)) { ContainerElement = undefined }
          break
        default:
          ContainerElement = Container as HTMLElement
      }
      if (ContainerElement == null) { return }

      if ((onlyFrom  != null) && ! matchesSelector(Event.target,onlyFrom))  { return }
      if ((neverFrom != null) &&   matchesSelector(Event.target,neverFrom)) { return }

      window.addEventListener('pointermove',  onPointerMove)
      window.addEventListener('pointerup',    onPointerUp)
      window.addEventListener('pointercancel',onPointerCancel)

      ViewRef.current.setPointerCapture?.(Event.pointerId)

      const ContainerBox = ContainerElement.getBoundingClientRect()

      const StartX = Event.clientX - ContainerBox.left + ContainerElement.scrollLeft
      const StartY = Event.clientY - ContainerBox.top  + ContainerElement.scrollTop

      StartPosition.current = { x:StartX, y:StartY }

      if (RecognizerMayClick) {
        isDragging.current = false
      } else {
        isDragging.current = RecognizerMayDrag
        if (RecognizerMayDrag && (ClickRadius === 0)) {
          onDragStart?.(0,0, StartX,StartY, Event)
        }
      }
    }

  /**** onPointerMove ****/

    const onPointerMove = (Event:PointerEvent) => {
      if (! RecognizerMayDrag) { return }

      if (ContainerElement == null) { return }

      const [ dx,dy, x,y ] = CallbackArguments(ContainerElement,Event)
      if (isDragging.current === false) {
        if (dx*dx + dy*dy < ClickRadius*ClickRadius) {
          return
        } else {
          isDragging.current = true
          onDragStart?.(dx,dy, x,y, Event)
        }
      }

      onDragContinuation?.apply(null,[ dx,dy, x,y, Event ])
    }

  /**** finishDragging ****/

    const finishDragging = (Event:PointerEvent, cancelled:boolean) => {
      window.removeEventListener('pointermove',  onPointerMove)
      window.removeEventListener('pointerup',    onPointerUp)
      window.removeEventListener('pointercancel',onPointerCancel)

      if (isDragging.current) {
        isDragging.current = false

        if (RecognizerMayDrag && cancelled) {
          onDragContinuation?.(0,0, StartPosition.current.x,StartPosition.current.y, Event)
          return
        }

        if ((ContainerElement != null) && RecognizerMayDrag) {
          onDragFinish?.apply(null,CallbackArguments(ContainerElement,Event))
        }
      }
    }

  /**** onPointerUp ****/

    const onPointerUp = (Event:PointerEvent) => {
      if (isDragging.current === false) {
        if (RecognizerMayClick) {
          let { ClickCount,Time } = lastClick.current
            const now = Date.now()
            ClickCount = (now-Time > MultiClickTimeSpan ? 1 : Math.min(ClickCount+1,MultiClickLimit))
          lastClick.current = { ClickCount,Time:now }

          if (ContainerElement != null) {
            const [ dx,dy, x,y ] = CallbackArguments(ContainerElement,Event)
            onClick?.apply(null,[ ClickCount, dx,dy, x,y, Event ])
          }
        }
      }

      finishDragging(Event,false)
    }

  /**** onPointerCancel ****/

    const onPointerCancel = (Event:PointerEvent) => {
      if (isDragging.current === true) {
        finishDragging(Event,true)
      }
    }

  /**** CallbackArguments ****/

    const CallbackArguments = (
      Container:HTMLElement, Event:PointerEvent
    ):[ dx:number,dy:number, x:number,y:number, Event:PointerEvent ] => {
      const ContainerBox = Container.getBoundingClientRect()

      const x = Event.clientX - ContainerBox.left + Container.scrollLeft
      const y = Event.clientY - ContainerBox.top  + Container.scrollTop

      const dx = x - StartPosition.current.x
      const dy = y - StartPosition.current.y

      return [dx,dy, x,y, Event]
    }

  /**** matchesSelector ****/

    function matchesSelector (
      Element:HTMLElement, Selector:AIM_Selector|HTMLElement|undefined
    ):boolean {
      switch (true) {
        case (Selector == null):             return true
        case (typeof Selector === 'string'): return Element.matches(Selector)
        default:                             return Element === Selector
      }
    }

    return onPointerDown
  }

/**** useFileDropCatcher ****/

/* Usage:
  const [ onDragEnter,onDragOver,onDragLeave,onDrop ] = useFileDropCatcher({
    accept:..., multiple:..., disabled:...,
    onDragEnter:(acceptableFiles,Event) => console.log('acceptable Files:',acceptableFiles),
    onDragOver: (acceptableFiles,Event) => console.log('acceptable Files:',acceptableFiles),
    onDragLeave:([],             Event) => console.log('acceptable Files:',acceptableFiles),
    onDrop:     (acceptableFiles,Event) => console.log('acceptable Files:',acceptableFiles),
  })

  html`<... onDragEnter=${onDragEnter} onDragOver=${onDragOver}
    onDragLeave=${onDragLeave} onDrop=${onDrop} .../>`
*/

  export type AIM_FileDropHandler = (acceptableFiles:any[], Event:Event) => void

  export function useFileDropCatcher ({
    accept, multiple, disabled,
    onDragEnter, onDragOver, onDragLeave, onDrop
  }:{
    accept?:  AIM_Textline,
    multiple?:boolean,
    disabled?:boolean,
    onDragEnter?:AIM_FileDropHandler,
    onDragOver?: AIM_FileDropHandler,
    onDragLeave?:AIM_FileDropHandler,
    onDrop?:     AIM_FileDropHandler,
  }):[ Function,Function,Function,Function ] {     // returns DOM event handlers
    allowTextline('list of accepted file types',accept)
    allowBoolean             ('"multiple" flag',multiple)
    allowBoolean             ('"disabled" flag',disabled)
    allowFunction     ('"onDragEnter" callback',onDragEnter)
    allowFunction      ('"onDragOver" callback',onDragOver)
    allowFunction     ('"onDragLeave" callback',onDragLeave)
    allowFunction          ('"onDrop" callback',onDrop)

    if (accept == null) {
      accept = '*'
    } else {
      accept = accept.trim().replace(/,+/g,' ').replace(/\s+/g,' ').toLowerCase()
    }

    if (! accept.split(' ').every(
      (Value:string) => ValueIsMIMEType(Value)
    )) throwError(
      'InvalidArgument: the given list of accepted file types is invalid'
    )
    const FileTypes = accept.split(' ').map(
      (Type:string) => Type.replace(/;.*$/,'').trim()
    )

    if (multiple == null) { multiple = false }
    if (disabled == null) { disabled = false }

  /**** acceptableFilesIn ****/

    const acceptableFilesIn = useCallback((Event:DragEvent):any[] => {
      const FileList = Event.dataTransfer?.files
      if (FileList == null) { return [] }

      function TypeIsAcceptable (FileType:string):boolean {
        return FileTypes.some((acceptedType:string) => {
          if (acceptedType.endsWith('/*')) {
            return FileType.startsWith(acceptedType.slice(0,-1))
          } else {
            return (FileType === acceptedType)
          }
        })
      }

      const acceptableFiles:any[] = Array.from(FileList).filter(
        (File:Indexable) => TypeIsAcceptable(File.type)
      )
      return acceptableFiles
    })

  /**** _onDragEnter ****/

    const _onDragEnter = useCallback((Event:Event):void => {
      if (disabled) { return fromDragging(Event) }           // no consumeEvent!

      const acceptableFiles = acceptableFilesIn(Event)
      if (acceptableFiles.length === 0) { return fromDragging(Event) }

      Event.preventDefault(); DraggingIsActive.current = true
      executeCallback('FileDropCatcher callback "onDragEnter"',onDragEnter,acceptableFiles,Event)
    })

  /**** _onDragOver ****/

    const _onDragOver = useCallback((Event:Event):void => {
      if (disabled) { return fromDragging(Event) }           // no consumeEvent!

      const acceptableFiles = acceptableFilesIn(Event)
      if (acceptableFiles.length === 0) { return fromDragging(Event) }

      Event.preventDefault()

      if (DraggingIsActive.current != true) {
        DraggingIsActive.current = true
        executeCallback('FileDropCatcher callback "onDragEnter"',onDragEnter,acceptableFiles,Event)
      }

      executeCallback('FileDropCatcher callback "onDragOver"',onDragOver,acceptableFiles,Event)
    })

  /**** _onDragLeave ****/

    const _onDragLeave = useCallback((Event:Event):void => {
      if (disabled) { return fromDragging(Event) }           // no consumeEvent!

      if (DraggingIsActive.current != true) { return }

      DraggingIsActive.current = false
      executeCallback('FileDropCatcher callback "onDragLeave"',onDragLeave,[],Event)
    })

  /**** _onDrop - independent of onDragEnter/Over/Leave ****/

    const _onDrop = useCallback((Event:Event):void => {
      if (disabled) { return fromDragging(Event) }           // no consumeEvent!

      const acceptableFiles = acceptableFilesIn(Event)
      if (acceptableFiles.length === 0) { return }

      Event.preventDefault()
      executeCallback('FileDropCatcher callback "onDrop"',onDrop,acceptableFiles,Event)
    })

  /**** fromDragging ****/

    const DraggingIsActive = useRef(false)

    const fromDragging = useCallback((Event:Event):void => {
      if (DraggingIsActive.current) {
        DraggingIsActive.current = false
        executeCallback('FileDropCatcher callback "onDragLeave"',onDragLeave,[],Event)
      }
    })

    return [ _onDragEnter,_onDragOver,_onDragLeave,_onDrop ]
  }


//----------------------------------------------------------------------------//
//                           Confirmation Handling                            //
//----------------------------------------------------------------------------//

  export function OperationWasConfirmed (Message?:string):boolean {
    let ConfirmationCode = Math.round(Math.random()*10000).toString()
      ConfirmationCode += '0000'.slice(ConfirmationCode.length)

    Message = (Message || 'This operation can not be undone.') + '\n\n' +
      'Please, enter the following number if you want to proceed:\n\n' +
      '   ' + ConfirmationCode + '\n\n' +
      'Otherwise, the operation will be cancelled'

    let UserInput = window.prompt(Message,'')
    if (UserInput === ConfirmationCode) {
      return true
    } else {
      window.alert('Operation will be cancelled')
      return false
    }
  }

//------------------------------------------------------------------------------
//--                              Normalizations                              --
//------------------------------------------------------------------------------

/**** normalizedName ****/

  export function normalizedName (Name:AIM_Name):AIM_Name {
    expectName('name',Name)
    return _normalizedName(Name)                                          // DRY
  }

/**** _normalizedName ****/

  export function _normalizedName (Name:AIM_Name):AIM_Name {
    return Name.trim()                         // no leading/trailing whitespace
      .replace(/\s+/g,' ')        // only blanks, no multiple consecutive blanks
      .toLowerCase()                                  // only lower-case letters
  }

/**** normalizedPath ****/

  export function normalizedPath (Path:AIM_Path):AIM_Path {
    expectPath('path',Path)
    return _normalizedPath(Path)                                          // DRY
  }

/**** _normalizedPath ****/

  export function _normalizedPath (Path:AIM_Path):AIM_Path {
    return Path.trim()                         // no leading/trailing whitespace
      .replace(/\s+/g,' ')        // only blanks, no multiple consecutive blanks
      .replace(/\/\/+/g,'/')                      // no multiple consecutive "/"
      .replace(/[ ]?(\/[ ]?)+/g,'/')     // no blanks around "/", no empty names
      .toLowerCase()                                  // only lower-case letters
  }

//------------------------------------------------------------------------------
//--                           Stylesheet Handling                            --
//------------------------------------------------------------------------------

/**** install stylesheet for AIM itself ****/

  let StyleElement = document.getElementById('AIM-Components-Stylesheet')
  if (StyleElement == null) {
    StyleElement = document.createElement('style')
      StyleElement.id          = 'AIM-Components-Stylesheet'
      StyleElement.textContent = `
/*******************************************************************************
*                                                                              *
*                Components (not only) for the AI Mentor (AIM)                 *
*                                                                              *
*******************************************************************************/

  :not(:defined) { visibility:hidden }

/**** some basic settings ****/

  .aim-component {
    display:block; position:relative;
    box-sizing:border-box;
  }

/**** OverlayView ****/

  .aim-overlay-view {
    box-sizing:border-box;
    display:block; position:fixed;
    background:white; color:black;
    box-shadow:0px 0px 5px 0px black;
    z-index:1000000;
  }
  .aim-overlay-view.in-dialog {
    z-index:3000000;
  }

/**** Underlay ****/

  .aim-underlay {
    display:block; position:fixed;
    left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
    z-index:1000000;
    pointer-events:auto;
  }
  .aim-underlay.in-dialog.modal {
    background-image:repeating-linear-gradient(-45deg,
      rgba(222,222,222, 1) 0px, rgba(222,222,222, 1) 4px,
      rgba(0,0,0, 0) 4px, rgba(0,0,0, 0) 8px
    ); background-size:11.31px 11.31px;
    opacity:0.1;
  }
  .aim-underlay.in-dialog {
    z-index:3000000;
  }

/**** DialogView ****/

  .aim-dialog-view {
    box-sizing:border-box;
    display:flex; flex-flow:column nowrap; align-items:stretch;
    position:fixed; overflow:hidden;
    border:solid 1px #000000; border-radius:4px;
    background:white; color:black;
    box-shadow:0px 0px 10px 0px rgba(0,0,0,0.5);
    z-index:2000000;
    pointer-events:auto;
  }
  .aim-dialog-view * {
    box-sizing:border-box;
  }

/**** DialogView Controls ****/

  .aim-dialog-view > .titlebar {
    display:flex; flex-flow:row nowrap; align-items:center; flex:0 0 auto;
    position:relative; left:0px; top:0px; right:0px; height:30px; overflow:hidden;
    background:#EEEEEE; border:none; border-bottom:solid 1px gray;
    border-radius:3px 3px 0px 0px;
    user-select:none; pointer-events:auto;

    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
  }

  .aim-dialog-view > .titlebar > .title {
    display:inline-block; position:relative; flex:1 0 auto;
    margin-left:6px; margin-top:3px; margin-right:10px; width:auto; height:24px;
    border:none;
    font-weight:bold; color:black; line-height:24px;
    user-select:none;
  }

  .aim-dialog-view.draggable > .titlebar > .title {
    cursor:grab;
  }

  .aim-dialog-view > .titlebar > .close-button {
    display:inline-block; position:relative;
    margin-top:3px; margin-right:4px; width:24px; height:24px;
    border:none;
    background:url(/icons/xmark.png);
    background-repeat:no-repeat;
    background-size:contain; background-position:center;
    cursor:pointer;
    user-select:none; pointer-events:auto;
  }

  .aim-dialog-view > .content-pane {
    display:inline-block; position:relative; flex:1 1 auto;
    left:0px; top:0px; width:auto; height:auto; overflow:auto;
    border:none; border-radius:0px 0px 3px 3px;
  }

  .aim-dialog-view.resizable > .content-pane {
    border-radius:0px;
  }

  .aim-dialog-view > .resizer {
    display:flex; flex-flow:row nowrap; align-items:center; flex:0 0 auto;
    position:relative; left:0px; top:0px; width:auto; height:9px;
    border:none; border-top:solid 1px gray; border-radius:0px 0px 3px 3px;
  }

  .aim-dialog-view > .resizer > .left-resizer {
    display:inline-block; position:relative;
    left:0px; bottom:0px; width:30px; height:9px;
    border:none; border-right:solid 1px gray;
    border-radius:0px 0px 0px 3px;
    cursor:nesw-resize; pointer-events:auto;

    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
  }

  .aim-dialog-view > .resizer > .middle-resizer {
    display:inline-block; flex:1 0 auto;
     position:relative; left:0px; top:0px; width:auto; height:9px;
    border:none; border-radius:0px;
    cursor:ns-resize; pointer-events:auto;

    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
  }

  .aim-dialog-view > .resizer > .right-resizer {
    display:inline-block; position:relative;
    left:0px; top:0px; width:30px; height:9px;
    border:none; border-left:solid 1px gray; border-radius:0px 0px 3px 0px;
    cursor:nwse-resize; pointer-events:auto;

    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
  }

/**** ModalLayer ****/

  .aim-modal-layer {
    display:block; position:fixed;
    left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
    background-image:repeating-linear-gradient(-45deg,
      rgba(222,222,222, 1) 0px, rgba(222,222,222, 1) 4px,
      rgba(0,0,0, 0) 4px, rgba(0,0,0, 0) 8px
    ); background-size:11.31px 11.31px;
    opacity:0.4;
    z-index:1999999;
    pointer-events:auto;
  }



/**** some common settings ****/

  .disabled, [disabled] { opacity:0.4 }
  .readonly             { background:none }
  .pointer-unaware      { pointer-events:none }


    `.trim()
    document.head.prepend(StyleElement) // this stylesheet should be the 1st one
  }

/**** installStylesheetFor ****/

  export function installStylesheetFor (
    Name:AIM_Name, Stylesheet:AIM_Text, overwrite:boolean = false
  ):void {
    expectPath('stylesheet name',Name)
    expectText     ('stylesheet',Stylesheet) // *C* could this be validated?
    expectBoolean   ('mode flag',overwrite)

    const StylesheetId = 'Stylesheet-for-' + _normalizedName(Name)

    let StyleElement = document.head.querySelector('style[id="' + StylesheetId + '"]')
    if (StyleElement == null) {
      StyleElement = document.createElement('style')
        StyleElement.id          = StylesheetId
        StyleElement.textContent = Stylesheet
      document.head.append(StyleElement)
    } else {
      if (overwrite) {
        StyleElement.textContent = Stylesheet
      } else {
        console.warn('multiple definitions for stylesheet "' + Name + '"')
      }
    }
  }

/**** uninstallStylesheetFor ****/

  export function uninstallStylesheetFor (Name:AIM_Name):void {
    expectPath('stylesheet name',Name)

    const StylesheetId = 'Stylesheet-for-' + _normalizedName(Name)

    let StyleElement = document.head.querySelector('style[id="' + StylesheetId + '"]')
    if (StyleElement != null) {
      StyleElement.remove()
    }
  }

//------------------------------------------------------------------------------
//--                              Error Handling                              --
//------------------------------------------------------------------------------

/**** ErrorIndicator ****/

  export function AIM_ErrorIndicator (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ ErrorToShow ] = parsedPropSet(PropSet,
        optionalValue('error',(Value:any) => (Value instanceof Error) || ValueIsText(Value)),
      )

      switch (true) {
        case ErrorToShow instanceof Error:
          break
        case ValueIsText(ErrorToShow):
          if (/^[^\n]+\n\n[^\n]+/.test(ErrorToShow)) {
            const Title   = ErrorToShow.replace(/\n\n.*$/,'')
            const Message = ErrorToShow.replace(/^[^\n]+\n\n/,'')
            ErrorToShow      = new Error(Message)
            ErrorToShow.name = Title
          } else {
            ErrorToShow      = new Error(ErrorToShow)
            ErrorToShow.name = 'Unexpected Failure'
          }
          break
        default:
          ErrorToShow      = new Error('' + ErrorToShow)
          ErrorToShow.name = 'Unexpected Failure'
      }

      const onClick = ():void => {
console.warn(ErrorToShow)
        window.alert(ErrorMessageFor(ErrorToShow))
      }

      return html`<div class="aim-error-indicator" onClick=${onClick}/>`
    })
  }

  installStylesheetFor('aim-error-indicator',`
    .aim-error-indicator {
      display:inline-block; position:relative;
      width:24px; height:24px;
    }

    .aim-error-indicator::after {
      content:'';
      display:block; position:absolute; overflow:hidden;
      left:0px; top:0px; width:24px; height:24px;
      background:url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 17.0001H12.01M12 10.0001V14.0001M6.41209 21.0001H17.588C19.3696 21.0001 20.2604 21.0001 20.783 20.6254C21.2389 20.2985 21.5365 19.7951 21.6033 19.238C21.6798 18.5996 21.2505 17.819 20.3918 16.2579L14.8039 6.09805C13.8897 4.4359 13.4326 3.60482 12.8286 3.32987C12.3022 3.09024 11.6978 3.09024 11.1714 3.32987C10.5674 3.60482 10.1103 4.4359 9.19614 6.09805L3.6082 16.2579C2.74959 17.819 2.32028 18.5996 2.39677 19.238C2.46351 19.7951 2.76116 20.2985 3.21709 20.6254C3.7396 21.0001 4.63043 21.0001 6.41209 21.0001Z' stroke='orange' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' fill='white'/%3E%3C/svg%3E");
      pointer-events:auto;
    }
  `)

/**** ErrorMessageFor ****/

  function ErrorMessageFor (ErrorToShow:Error):any {
    let ErrorName    = ErrorToShow.name  ?? ''
    let ErrorMessage = ErrorToShow.message
    let StackTrace   = ErrorToShow.stack ?? ''

    const Title   = ErrorName.replace(/([a-z])([A-Z])/g,'$1 $2')
    const Message = ErrorMessage[0].toUpperCase() + ErrorMessage.slice(1)

    if (StackTrace === '') {
      return `${Title}\n\n${Message}`
    } else {
      return `${Title}\n\n${Message}\n\n${StackTrace}`
    }
  }

/**** pseudoRef ****/

  export function pseudoRef (Value:any):Indexable {
    return { current:Value }
  }

/**** safelyRendered ****/

  export function safelyRendered (Renderer:Function):any {
    expectFunction('rendering function',Renderer)

    const [ Error,resetError ] = useErrorBoundary()
    if (Error == null) {
      return Renderer()
    } else {
      const ComponentName = Renderer.name ?? ''
      if (ComponentName.trim() === '') {
        console.warn('error while rendering a preact component: ' + Error)
      } else {
        console.warn(
          'error while rendering component ' + quoted(ComponentName) + ': ' +
          Error
        )
      }
      return html`<${AIM_ErrorIndicator} error=${Error} resetError=${resetError}/>`
    }
  }

/**** OverlayBase ****/

  export type AIM_Overlay = {
    Name:AIM_Name, isModal:boolean,
    Renderer:AIM_Renderer,
    onOpen?:Function,       onClose?:Function,
    OffsetX?:AIM_Location,  OffsetY:AIM_Location,
    Width?:AIM_Dimension,   Height?:AIM_Dimension,
    minWidth?:AIM_Dimension,minHeight?:AIM_Dimension,
    maxWidth?:AIM_Dimension,maxHeight?:AIM_Dimension,
  }

  type AIM_$Overlay = AIM_Overlay & {
    [$normalizedName]:AIM_Name,
  }

  export function OverlayBase (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, APIRef, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue  ('apiref',(Value:any) => ValueIsRef(Value) && ValueIsPlainObject(Value.current))
      )

      const BaseRef        = useRef()             // used to position an overlay
      const OverlayListRef = useRef([])       // list of currently open overlays

      const [ State,setState ] = useState()     // used for explicit rerendering
      const rerenderOverlayBase = useCallback(() => setState({}))

  /**** openOverlay ****/

    function openOverlay (Descriptor:AIM_Overlay & Indexable):void {
      expectPlainObject('overlay descriptor',Descriptor)

      Descriptor = { ...Descriptor }
      Object.keys(Descriptor).forEach((Key:string) => {
        if (Descriptor[Key] === undefined) { delete Descriptor[Key] }
      })                     // "null" values are kept, "undefined" ones deleted

      validateOverlayDescriptor(Descriptor)

      let {
        Name, isModal, Renderer, onOpen,onClose,
        OffsetX,OffsetY, Width,Height, minWidth,minHeight, maxWidth,maxHeight,
      } = Descriptor

      const normalizedName = _normalizedName(Name)

      if (OverlayIsOpen(Name)) throwError( // *C* should be based on oldState in changeState
        'OverlayAlreadyOpen: there is already an overlay called ' + quoted(Name)
      )

    /**** now actually "open" the overlay ****/

      OverlayListRef.current.push({
        Name, [$normalizedName]:normalizedName, isModal:isModal ?? false,
        Renderer, onOpen,onClose,
        OffsetX:OffsetX ?? 0,OffsetY:OffsetY ?? 0, Width,Height,
        minWidth:minWidth ?? 0,minHeight:minHeight ?? 0, maxWidth,maxHeight,
      })

      rerenderOverlayBase()
    }

  /**** openOverlayAtPointer ****/

    function openOverlayAtPointer (
      Descriptor:AIM_Overlay, Event:PointerEvent
    ):void {
      expectPlainObject('overlay descriptor',Descriptor)
      expectInstanceOf      ('pointer event',Event, PointerEvent)

      const Overlayable = BaseRef.current
      if (Overlayable != null) {
        const Box = Overlayable.getBoundingClientRect()

        let OffsetX = Event.clientX - Box.left + Overlayable.scrollLeft
        let OffsetY = Event.clientY - Box.top  + Overlayable.scrollTop

        Descriptor = { ...Descriptor, OffsetX,OffsetY }
      }

      openOverlay(Descriptor)
    }

/**** validateOverlayDescriptor ****/

  function validateOverlayDescriptor (Value:any):void {
    if (! ValueIsPlainObject(Value)) throwError(
      'InvalidArgument: the given overlay descriptor is no plain JavaScript object'
    )

    let OverlayIdentification = 'overlay descriptor'
    try {
      allowName('Name',Value.Name)
      if (Value.Name == null) throwError('MissingArgument: missing "Name"')

      OverlayIdentification = 'descriptor for overlay "' + Value.Name + '"'

      allowBoolean    ('isModal',Value.isModal)
      expectFunction ('Renderer',Value.Renderer)
      allowFunction    ('onOpen',Value.onOpen)
      allowFunction   ('onClose',Value.onClose)
      allowLocation   ('OffsetX',Value.OffsetX)
      allowLocation   ('OffsetY',Value.OffsetY)
      allowDimension    ('Width',Value.Width)
      allowDimension   ('Height',Value.Height)
      allowDimension ('minWidth',Value.minWidth)
      allowDimension('minHeight',Value.minHeight)
      allowDimension ('maxWidth',Value.maxWidth)
      allowDimension('maxHeight',Value.maxHeight)
    } catch (Signal:any) {
      if ((Signal.name === 'MissingArgument') || (Signal.name === 'InvalidArgument')) {
        Signal.message += ' in ' + OverlayIdentification
      }
      throw Signal
    }
  }

  /**** closeOverlay ****/

    function closeOverlay (Name:AIM_Name):void {
      expectName('overlay name',Name)
      const normalizedName = _normalizedName(Name)

      const OverlayList = OverlayListRef.current
      if (OverlayList.length === 0) { return }

      const OverlayIndex = OverlayList.findIndex(
        (Overlay:AIM_$Overlay) => (Overlay[$normalizedName] === normalizedName)
      )
      if (OverlayIndex < 0) { return }                  // i.e., nothing changed

      OverlayListRef.current = OverlayList.filter(
        (_:any, Index:number) => (Index !== OverlayIndex)
      )

      rerenderOverlayBase()
    }

  /**** closeAllOverlays ****/

    function closeAllOverlays ():void {
      const OverlayList = OverlayListRef.current
      if (OverlayList.length === 0) { return }

      OverlayListRef.current = []

      rerenderOverlayBase()
    }

  /**** openOverlays ****/

    const openOverlays:AIM_Name[] = OverlayListRef.current.map(
      (Overlay:AIM_$Overlay) => Overlay.Name as AIM_Name
    )

  /**** OverlayIsOpen ****/

    function OverlayIsOpen (Name:AIM_Name):boolean {
      expectName('overlay name',Name)
      const normalizedName = _normalizedName(Name)

      return (OverlayListRef.current.findIndex(
        (Overlay:AIM_$Overlay) => (Overlay[$normalizedName] === normalizedName)
      ) >= 0)
    }

/**** renderedOverlays ****/

  function renderedOverlays (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ OverlayList,BaseRef ] = parsedPropSet(PropSet,
        mandatoryValue('overlaylist',(Value:any) => ValueIsListSatisfying(Value,ValueIsPlainObject /*ValueIsOverlay*/)),
        mandatoryValue    ('baseref',() => true),
      )
      if ((OverlayList == null) || (OverlayList.length === 0)) { return }

      const { closeOverlay } = useOverlayContext()

      let lastOverlayIndex = OverlayList.length-1
      return html`
        ${OverlayList.map((Overlay:AIM_$Overlay, Index:number) => {
          if (Index === lastOverlayIndex) {
            return html`
              <${AIM_Underlay}    Overlay=${Overlay} closeOverlay=${closeOverlay}/>
              <${AIM_OverlayView} Overlay=${Overlay} BaseRef=${BaseRef}/>
            `
          } else {
            return html`<${AIM_OverlayView} Overlay=${Overlay} BaseRef=${BaseRef}/>`
          }
        })}
      `
    })
  }


      const OverlayAPI = {
        openOverlay, openOverlayAtPointer, closeOverlay, closeAllOverlays,
        openOverlays:[ ...OverlayListRef.current ], OverlayIsOpen,
      }

      const OverlayContext = useOverlayContext()
      Object.assign(OverlayContext,OverlayAPI)          // referentially stable!

      if (APIRef != null) {
        if (APIRef.current == null) { APIRef.current = {} }
        Object.assign(APIRef.current,OverlayAPI)
      }

      return html`<${AIM_OverlayContext.Provider} value=${OverlayContext}>
        <div class="aim-component overlay-base ${Classes ?? ''}"
          ...${RestProps} ref=${BaseRef}
        >
          ${ContentList}
          <${renderedOverlays} OverlayList=${OverlayListRef.current} BaseRef=${BaseRef}/>
        </>
      </>`
    })
  }

  installStylesheetFor('aim-component.overlay-base',`
    .aim-component.overlay-base > * {
      left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
     }
  `)

//------------------------------------------------------------------------------
//--                               AIM_Underlay                               --
//------------------------------------------------------------------------------

  const AIM_Underlay_EventTypes = [
    'click', 'dblclick',
    /*'mousedown',*/ 'mouseup', 'mousemove', 'mouseover', 'mouseout',
    'mouseenter', 'mouseleave',
    /*'touchstart',*/ 'touchend', 'touchmove', 'touchcancel',
    /*'pointerdown',*/ 'pointerup', 'pointermove', 'pointerover', 'pointerout',
    'pointerenter', 'pointerleave', 'pointercancel',
    'keydown', 'keyup', 'keypress',
    'wheel', 'contextmenu', 'focus', 'blur'
  ]

  function AIM_Underlay (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Overlay,closeOverlay ] = parsedPropSet(PropSet,
        mandatoryValue        ('overlay',ValueIsPlainObject /*ValueIsOverlay*/),
        mandatoryFunction('closeoverlay')
      )

      const UnderlayRef = useRef()

      useEffect(() => {                      // install/uninstall event handlers
        const View = UnderlayRef.current as HTMLElement

        AIM_Underlay_EventTypes.forEach((EventType:string) => {
          View.addEventListener(EventType,consumeEvent)
        })

        return () => {
          AIM_Underlay_EventTypes.forEach((EventType:string) => {
            View.removeEventListener(EventType,consumeEvent)
          })
        }
      },[])                          // to be run after mount and before unmount

      const handleEvent = (Event:Event) => {
        consumeEvent(Event)
        if (! Overlay.isModal) {
          closeOverlay(Overlay.Name)
        }
      }

      const DialogContext = useDialogContext()
      const inDialog = (DialogContext.DialogName != null)

      return createPortal(html`<div
        class="aim-underlay ${Overlay.isModal ? 'modal' : ''} ${inDialog ? 'in-dialog' : ''}"
        ref=${UnderlayRef}
        onMouseDown=${handleEvent} onPointerDown=${handleEvent}
        onTouchStart=${handleEvent}
      />`,document.body)
    })
  }

//------------------------------------------------------------------------------
//--                             AIM_OverlayView                              --
//------------------------------------------------------------------------------

  function AIM_OverlayView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Overlay, BaseRef ] = parsedPropSet(PropSet,
        mandatoryValue('overlay',ValueIsPlainObject /*ValueIsOverlay*/),
        mandatoryValue('baseref',() => true),
      )
      const Base = BaseRef.current as HTMLElement

      const [ State,setState ] = useState()     // used for explicit rerendering
      const rerender = useCallback(() => setState({}))

      useEffect(() => {                         // handle "onOpen" and "onClose"
        executeCallback(
          `"onOpen" callback of overlay ${Overlay.Name}`,
          Overlay.onOpen, Overlay.Name, { ...Overlay }
        )

        setTimeout(rerender,0)        // updates size and position, if necessary

        return () => {
          executeCallback(
            `"onClose" callback of overlay ${Overlay.Name}`,
            Overlay.onClose, Overlay.Name, { ...Overlay }
          )
        }
      },[])                          // to be run after mount and before unmount

    /**** compute position and size... ****/

      const OverlayRef = useRef()

      let {
        OffsetX,OffsetY,
        Width,Height, minWidth,minHeight, maxWidth,maxHeight,
      } = Overlay

      const { left:BaseX,top:BaseY } = Base.getBoundingClientRect()

      let x = BaseX, y = BaseY
      if (OverlayRef.current == null) {                // first render is hidden
        x += OffsetX ?? 0; y += OffsetY ?? 0
      } else {                                         // all others are visible
        let { width,height } = OverlayRef.current.getBoundingClientRect()

        Width  = Math.max(minWidth  ?? 0, Math.min(width, window.innerWidth,  maxWidth  ?? Infinity))
        Height = Math.max(minHeight ?? 0, Math.min(height,window.innerHeight, maxHeight ?? Infinity))

        x = Math.max(0,Math.min(x+(OffsetX ?? 0),window.innerWidth-Width))
        y = Math.max(0,Math.min(y+(OffsetY ?? 0),window.innerHeight-Height))
      }

      Object.assign(Overlay,{// modifies "Overlay" in-situ - that's a poor hack!
        OffsetX:x-BaseX,OffsetY:y-BaseY, Width,Height
      })

    /**** ...then render the overlay ****/

      const OverlayRenderer = useCallback(() => executedCallback(
        `"Renderer" callback of overlay ${Overlay.Name}`,
        Overlay.Renderer, Overlay.Name, { ...Overlay }
      ),[ Overlay ])

      const DialogContext = useDialogContext()
      const inDialog = (DialogContext.DialogName != null)

      const OverlayContext = useOverlayContext()
      return createPortal(html`
       <${AIM_OverlayContext.Provider} value=${{
         ...OverlayContext, OverlayName:Overlay.Name
       }}>
        <div class="aim-overlay-view ${inDialog ? 'in-dialog' : ''}" style="
          visibility:${OverlayRef == null ? 'hidden' : 'visible'};
          left:${x}px; top:${y}px;
          width: ${Width  == null ? 'auto' : `${Width}px`};
          height:${Height == null ? 'auto' : `${Height}px`};
          min-width:${minWidth}px; min-height:${minHeight}px;
          max-width: ${maxWidth  == null ? 'auto' : `${maxWidth}px`};
          max-height:${maxHeight == null ? 'auto' : `${maxHeight}px`};
        " key="overlay:${Overlay.Name}" ref=${OverlayRef}>
          <${OverlayRenderer}/>
        </>
       </>
      `,document.body)
    })
  }

/**** Overlay Context ****/

  const AIM_OverlayContext = createContext({             // will be filled later
    OverlayName:undefined,                   // only set while within an overlay

  /**** Overlay API - only set while within an OverlayBase ****/

    openOverlay:undefined, openOverlayAtPointer:undefined,
    closeOverlay:undefined, closeAllOverlays:undefined,
    openOverlays:[], OverlayIsOpen:undefined,
  })

  export function useOverlayContext () {
    return useContext(AIM_OverlayContext)
  }

/**** DialogBase ****/

  export type AIM_Dialog = {
    Name:AIM_Name, Title?:AIM_Textline, isModal:boolean,
    hasCloseButton?:boolean, isResizable?:boolean, isDraggable?:boolean,
      dontShrink?:boolean,
    Renderer:AIM_Renderer,
    onOpen?:Function,       onClose?:Function,
    OffsetX?:AIM_Location,  OffsetY:AIM_Location,
    Width?:AIM_Dimension,   Height?:AIM_Dimension,
    minWidth?:AIM_Dimension,minHeight?:AIM_Dimension,
    maxWidth?:AIM_Dimension,maxHeight?:AIM_Dimension,
  }

  type AIM_$Dialog = AIM_Dialog & {
    [$normalizedName]:AIM_Name,
  }

  export function DialogBase (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, APIRef, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue  ('apiref',(Value:any) => ValueIsRef(Value) && ValueIsPlainObject(Value.current))
      )

      const BaseRef       = useRef()                // used to position a dialog
      const DialogListRef = useRef([])         // list of currently open dialogs

      const [ State,setState ] = useState()     // used for explicit rerendering
      const rerenderDialogBase = useCallback(() => setState({}))

  /**** openDialog ****/

    function openDialog (Descriptor:AIM_Overlay & Indexable):void {
      expectPlainObject('dialog descriptor',Descriptor)

      Descriptor = { ...Descriptor }
      Object.keys(Descriptor).forEach((Key:string) => {
        if (Descriptor[Key] === undefined) { delete Descriptor[Key] }
      })                     // "null" values are kept, "undefined" ones deleted

      validateDialogDescriptor(Descriptor)

      let {
        Name, Title, isModal, hasCloseButton, isResizable, isDraggable, dontShrink,
        Renderer, onOpen,onClose,
        OffsetX,OffsetY, Width,Height, minWidth,minHeight, maxWidth,maxHeight,
      } = Descriptor

      const normalizedName = _normalizedName(Name)

      if (DialogIsOpen(Name)) throwError( // *C* should be based on oldState in changeState
        'DialogAlreadyOpen: there is already a dialog called ' + quoted(Name)
      )

    /**** now actually "open" the dialog ****/

      DialogListRef.current.push({
        Name, [$normalizedName]:normalizedName, Title, isModal:isModal ?? false,
        hasCloseButton, isResizable, isDraggable, dontShrink,
        Renderer, onOpen,onClose,
        OffsetX:OffsetX ?? 0,OffsetY:OffsetY ?? 0, Width,Height,
        minWidth:minWidth ?? 0,minHeight:minHeight ?? 0, maxWidth,maxHeight,
      })

      rerenderDialogBase()
    }

/**** validateDialogDescriptor ****/

  function validateDialogDescriptor (Value:any):void {
    if (! ValueIsPlainObject(Value)) throwError(
      'InvalidArgument: the given dialog descriptor is no plain JavaScript object'
    )

    let DialogIdentification = 'dialog descriptor'
    try {
      allowName('Name',Value.Name)
      if (Value.Name == null) throwError('MissingArgument: missing "Name"')

      DialogIdentification = 'descriptor for dialog "' + Value.Name + '"'

      allowBoolean       ('isModal',Value.isModal)
      allowBoolean('hasCloseButton',Value.hasCloseButton)
      allowBoolean   ('isResizable',Value.isResizable)
      allowBoolean   ('isDraggable',Value.isDraggable)
      allowBoolean    ('dontShrink',Value.dontShrink)
      expectFunction    ('Renderer',Value.Renderer)
      allowFunction       ('onOpen',Value.onOpen)
      allowFunction      ('onClose',Value.onClose)
      allowLocation      ('OffsetX',Value.OffsetX)
      allowLocation      ('OffsetY',Value.OffsetY)
      allowDimension       ('Width',Value.Width)
      allowDimension      ('Height',Value.Height)
      allowDimension    ('minWidth',Value.minWidth)
      allowDimension   ('minHeight',Value.minHeight)
      allowDimension    ('maxWidth',Value.maxWidth)
      allowDimension   ('maxHeight',Value.maxHeight)
    } catch (Signal:any) {
      if ((Signal.name === 'MissingArgument') || (Signal.name === 'InvalidArgument')) {
        Signal.message += ' in ' + DialogIdentification
      }
      throw Signal
    }
  }

  /**** closeDialog ****/

    function closeDialog (Name:AIM_Name):void {
      expectName('dialog name',Name)
      const normalizedName = _normalizedName(Name)

      const DialogList = DialogListRef.current
      if (DialogList.length === 0) { return }

      const DialogIndex = DialogList.findIndex(
        (Dialog:AIM_$Dialog) => (Dialog[$normalizedName] === normalizedName)
      )
      if (DialogIndex < 0) { return }                   // i.e., nothing changed

      DialogListRef.current = DialogList.filter(
        (_:any, Index:number) => (Index !== DialogIndex)
      )

      rerenderDialogBase()
    }

  /**** closeAllDialogs ****/

    function closeAllDialogs ():void {
      const DialogList = DialogListRef.current
      if (DialogList.length === 0) { return }

      DialogListRef.current = []

      rerenderDialogBase()
    }

  /**** openDialogs ****/

    const openDialogs:AIM_Name[] = DialogListRef.current.map(
      (Dialog:AIM_$Dialog) => Dialog.Name as AIM_Name
    )

  /**** DialogIsOpen ****/

    function DialogIsOpen (Name:AIM_Name):boolean {
      expectName('dialog name',Name)
      const normalizedName = _normalizedName(Name)

      return (DialogListRef.current.findIndex(
        (Dialog:AIM_$Dialog) => (Dialog[$normalizedName] === normalizedName)
      ) >= 0)
    }

  /**** DialogIsFrontmost ****/

    function DialogIsFrontmost (Name:AIM_Name):boolean {
      expectName('dialog name',Name)
      const normalizedName = _normalizedName(Name)

      const DialogList = DialogListRef.current
      return (DialogList[DialogList.length-1]?.[$normalizedName] === normalizedName)
    }

  /**** bringDialogToFront ****/

    function bringDialogToFront (Name:AIM_Name):void {
      expectName('dialog name',Name)
      const normalizedName = _normalizedName(Name)

      let DialogList = DialogListRef.current

      const DialogIndex = DialogList.findIndex(
        (Dialog:AIM_$Dialog) => (Dialog[$normalizedName] === normalizedName)
      )
      if ((DialogIndex < 0) || (DialogIndex === DialogIndex.length-1)) {
        return                                          // i.e., nothing changed
      }

      DialogListRef.current = [
        ...DialogList.filter((_:any, Index:number) => Index !== DialogIndex),
        DialogList[DialogIndex]
      ]

//    rerenderDialogBase()     // do not rerender self, let actual handler do it
    }

/**** renderedDialogs ****/

  function renderedDialogs (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ DialogList,BaseRef ] = parsedPropSet(PropSet,
        mandatoryValue('dialoglist',(Value:any) => ValueIsListSatisfying(Value,ValueIsPlainObject /*ValueIsDialog*/)),
        mandatoryValue   ('baseref',() => true),
      )
      if ((DialogList == null) || (DialogList.length === 0)) { return }

      const { closeDialog } = useDialogContext()

      let lastDialogIndex = DialogList.length-1
      return html`
        ${DialogList.map((Dialog:AIM_$Dialog, Index:number) => {
          if (Index === lastDialogIndex) {
            return html`
              <${AIM_ModalLayer} Dialog=${Dialog} closeDialog=${closeDialog}/>
              <${AIM_DialogView} Dialog=${Dialog} BaseRef=${BaseRef} rerender=${rerenderDialogBase}/>
            `
          } else {
            return html`<${AIM_DialogView} Dialog=${Dialog} BaseRef=${BaseRef}/>`
          }
        })}
      `
    })
  }


      const DialogAPI = {
        openDialog, closeDialog, closeAllDialogs,
        openDialogs:[ ...DialogListRef.current ], DialogIsOpen,
        DialogIsFrontmost, bringDialogToFront,
      }

      const DialogContext = useDialogContext()
      Object.assign(DialogContext,DialogAPI)            // referentially stable!

      if (APIRef != null) {
        if (APIRef.current == null) { APIRef.current = {} }
        Object.assign(APIRef.current,DialogAPI)
      }

      return html`<${AIM_DialogContext.Provider} value=${DialogContext}>
        <div class="aim-component dialog-base ${Classes ?? ''}"
          ...${RestProps} ref=${BaseRef}
        >
          ${ContentList}
          <${renderedDialogs} DialogList=${DialogListRef.current} BaseRef=${BaseRef}/>
        </>
      </>`
    })
  }

  installStylesheetFor('aim-component.dialog-base',`
    .aim-component.dialog-base > * {
      left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
     }
  `)

//------------------------------------------------------------------------------
//--                              AIM_ModalLayer                              --
//------------------------------------------------------------------------------

  const AIM_ModalLayer_EventTypes = [
    'click', 'dblclick',
    'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout',
    'mouseenter', 'mouseleave',
    'touchstart', 'touchend', 'touchmove', 'touchcancel',
    'pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout',
    'pointerenter', 'pointerleave', 'pointercancel',
    'keydown', 'keyup', 'keypress',
    'wheel', 'contextmenu', 'focus', 'blur'
  ]

  function AIM_ModalLayer (PropSet:Indexable):any {
    return safelyRendered(() => {
      const ModalLayerRef = useRef()

      useEffect(() => {                      // install/uninstall event handlers
        const View = ModalLayerRef.current as HTMLElement

        AIM_ModalLayer_EventTypes.forEach((EventType:string) => {
          View.addEventListener(EventType,consumeEvent)
        })

        return () => {
          AIM_ModalLayer_EventTypes.forEach((EventType:string) => {
            View.removeEventListener(EventType,consumeEvent)
          })
        }
      },[])                          // to be run after mount and before unmount

      return createPortal(html`<div class="aim-modal-layer"
        ref=${ModalLayerRef}
      />`,document.body)
    })
  }

//------------------------------------------------------------------------------
//--                              AIM_DialogView                              --
//------------------------------------------------------------------------------

  function AIM_DialogView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Dialog, BaseRef, rerenderDialogBase ] = parsedPropSet(PropSet,
        mandatoryValue     ('dialog',ValueIsPlainObject /*ValueIsDialog*/),
        mandatoryValue    ('baseref',() => true),
        mandatoryFunction('rerender')
      )              // "BaseRef" is used to place a dialog relative to its base
      const Base = BaseRef.current as HTMLElement

      const [ State,setState ] = useState()     // used for explicit rerendering
      const rerender = useCallback(() => setState({}))

      useEffect(() => {                         // handle "onOpen" and "onClose"
        executeCallback(
          `"onOpen" callback of dialog ${Dialog.Name}`,
          Dialog.onOpen, Dialog.Name, { ...Dialog }
        )

        setTimeout(rerender,0)        // updates size and position, if necessary

        return () => {
          executeCallback(
            `"onClose" callback of dialog ${Dialog.Name}`,
            Dialog.onClose, Dialog.Name, { ...Dialog }
          )
        }
      },[])                          // to be run after mount and before unmount

    /**** compute absolute size minimums ****/

      let {
        Name, Title, hasCloseButton, isResizable,isDraggable, OffsetX,OffsetY,
        Width,Height, minWidth,minHeight, maxWidth,maxHeight, dontShrink,
      } = Dialog

      const withTitlebar = (Title != null) || hasCloseButton || isDraggable
      const resizable    = (isResizable ? 'resizable' : '')
      const draggable    = (isDraggable ? 'draggable' : '')

      if (minWidth  == null) { minWidth  = 0 }
      if (minHeight == null) { minHeight = 0 }

      const DecorationHeight = (withTitlebar ? 30 : 0) + (isResizable ? 10 : 0)

      if (withTitlebar || isResizable) {
        minHeight += DecorationHeight
        if (Height != null) { Height += DecorationHeight }
      }
      if (hasCloseButton) { minWidth = Math.max(40,minWidth) }
      if (isResizable)    { minWidth = Math.max(30+10+30,minWidth) }

    /**** compute position and size (and implement any constraints)... ****/

      const DialogRef = useRef()

      const { left:BaseX,top:BaseY } = Base.getBoundingClientRect()

      let x = BaseX, y = BaseY
      if (DialogRef.current == null) {                 // first render is hidden
        x += OffsetX ?? 0; y += OffsetY ?? 0
      } else {                                         // all others are visible
        let {  width:curWidth,height:curHeight  } = DialogRef.current.getBoundingClientRect()
        let { width:BaseWidth,height:BaseHeight } = Base.getBoundingClientRect()

      /**** never larger than the viewport ****/

        Width  = Math.min(Width  ?? curWidth, window.innerWidth)
        Height = Math.min(Height ?? curHeight,window.innerHeight)

      /**** if OffsetX/Y are missing: center dialog ****/

        if (OffsetX == null) { Dialog.OffsetX = OffsetX =  (BaseWidth-Width)/2 }
        if (OffsetY == null) { Dialog.OffsetY = OffsetY = (BaseHeight-Height)/2 }

      /**** keep dialog within viewport ****/

        x = Math.max(0,Math.min(x+OffsetX,window.innerWidth-Width))
        y = Math.max(0,Math.min(y+OffsetY,window.innerHeight-Height))

        Dialog.OffsetX = x-BaseX
        Dialog.OffsetY = y-BaseY

      /**** if need be, use current size as minimum ****/

        if (dontShrink === true) {
          minWidth  = Dialog.minWidth  = Math.max (minWidth,Width)
          minHeight = Dialog.minHeight = Math.max(minHeight,Height)-DecorationHeight
          delete Dialog.dontShrink
        }

        Dialog.Width  = Width
        Dialog.Height = Height - DecorationHeight
      }

      const DialogContext = useDialogContext()
      const { closeDialog, DialogIsFrontmost, bringDialogToFront } = DialogContext

    /**** prepare dragging ****/

      const DragInfo = useRef({ Mode:undefined, x:0,y:0, Width:0,Height:0 })
                                                    // for dragging and resizing
      const startDialogDragging = (
        isDraggable
        ? useDragging({
            ViewRef:DialogRef, onlyFrom:'.title', neverFrom:'.close-button',
            onDragStart:       (dx:number,dy:number, x:number,y:number, Event:Event) => DragInfo.current = { x:Dialog.OffsetX,y:Dialog.OffsetY },
            onDragContinuation:(dx:number,dy:number, x:number,y:number, Event:Event) => moveDialog(dx,dy),
            onDragFinish:      (dx:number,dy:number, x:number,y:number, Event:Event) => moveDialog(dx,dy),
            onDragCancellation:(dx:number,dy:number, x:number,y:number, Event:Event) => moveDialog(dx,dy),
          })
        : undefined
      )

      const moveDialog = useCallback((dx:number,dy:number) => {
        Dialog.OffsetX = DragInfo.current.x + dx       // constraints will be...
        Dialog.OffsetY = DragInfo.current.y + dy   // ...integrated in main code

        if (! DialogIsFrontmost(Dialog.Name)) {
          bringDialogToFront(Dialog.Name)
          rerenderDialogBase()
        }
        rerender()                              // dialog only, not dialog base!
      },[ Dialog, bringDialogToFront, rerender ])

    /**** prepare resizing ****/

      const startDialogResizing = (
        isResizable
        ? useDragging({
            ViewRef:DialogRef, onlyFrom:'.left-resizer,.middle-resizer,.right-resizer',
            onDragStart:       (dx:number,dy:number, x:number,y:number, Event:Event) => startResizing(Event),
            onDragContinuation:(dx:number,dy:number, x:number,y:number, Event:Event) => resizeDialog(dx,dy),
            onDragFinish:      (dx:number,dy:number, x:number,y:number, Event:Event) => resizeDialog(dx,dy),
            onDragCancellation:(dx:number,dy:number, x:number,y:number, Event:Event) => resizeDialog(dx,dy),
          })
        : undefined
      )

      const startResizing = useCallback((Event:PointerEvent) => {
        let ResizeMode
          const ClassList = (Event.target as HTMLElement).classList
          switch (true) {
            case ClassList.contains('left-resizer'):   ResizeMode = 'resize-sw'; break
            case ClassList.contains('middle-resizer'): ResizeMode = 'resize-s';  break
            case ClassList.contains('right-resizer'):  ResizeMode = 'resize-se'; break
          }
        DragInfo.current = {
          Mode:ResizeMode,
          x:Dialog.OffsetX, Width:Dialog.Width,
          y:Dialog.OffsetY, Height:Dialog.Height,
        }
      },[ Dialog ])

      const resizeDialog = useCallback((dx:number,dy:number) => {
        const { minWidth,maxWidth, minHeight,maxHeight } = Dialog

        let newWidth:number = DragInfo.current.Width
        switch (DragInfo.current.Mode) {
          case 'resize-sw':
            newWidth = Math.max(minWidth ?? 0,Math.min(newWidth-dx,maxWidth ?? Infinity))
            dx       = newWidth-DragInfo.current.Width

            Dialog.OffsetX = DragInfo.current.x - dx
            Dialog.Width   = DragInfo.current.Width + dx
            break
          case 'resize-se':
            Dialog.Width = Math.max(
              minWidth ?? 0,Math.min(DragInfo.current.Width+dx,maxWidth ?? Infinity)
            )
        }
        Dialog.Height = Math.max(
          minHeight ?? 0,Math.min(DragInfo.current.Height+dy,maxHeight ?? Infinity)
        )

        if (! DialogIsFrontmost(Dialog.Name)) {
          bringDialogToFront(Dialog.Name)
          rerenderDialogBase()
        }
        rerender()                              // dialog only, not dialog base!
      },[ Dialog, bringDialogToFront, rerender ])


    /**** ...then render the dialog ****/

      const DialogRenderer = useCallback(() => executedCallback(
        `"Renderer" callback of dialog ${Dialog.Name}`,
        Dialog.Renderer, Dialog.Name, { ...Dialog }
      ),[ Dialog ])

      return createPortal(html`
       <${AIM_DialogContext.Provider} value=${{
         ...DialogContext, DialogName:Dialog.Name
       }}>
        <div class="aim-dialog-view ${resizable} ${draggable}"
          key="dialog:${Name}" name=${Name} ref=${DialogRef} style="
            visibility:${DialogRef == null ? 'hidden' : 'visible'};
            left:${x}px; top:${y}px;
            width: ${Width  == null ? 'auto' : `${Width}px`};
            height:${Height == null ? 'auto' : `${Height}px`};
            min-width:${minWidth}px; min-height:${minHeight}px;
            max-width: ${maxWidth  == null ? 'auto' : `${maxWidth}px`};
            max-height:${maxHeight == null ? 'auto' : `${maxHeight}px`};
          " onPointerDown=${() => bringDialogToFront(Name)}
        >
          ${withTitlebar
            ? html`<div class="titlebar" onPointerDown=${startDialogDragging}>
                <div class="title">${Title ?? ''}</>
                ${hasCloseButton ? html`<div class="close-button" onClick=${() => closeDialog(Dialog.Name)}/>`: ''}
              </>`
            : ''
          }
          <div class="content-pane">
            <${DialogRenderer}/>
          </>
          ${isResizable
            ? html`<div class="resizer">
                <div class="left-resizer"   onPointerDown=${startDialogResizing}/>
                <div class="middle-resizer" onPointerDown=${startDialogResizing}/>
                <div class="right-resizer"  onPointerDown=${startDialogResizing}/>
              </>`
            : ''
          }
        </>
       </>
      `,document.body)
    })
  }

/**** Dialog Context ****/

  const AIM_DialogContext = createContext({              // will be filled later
    DialogName:undefined,                      // only set while within a dialog

  /**** Dialog API - only set while within a DialogBase ****/

    openDialog:undefined, closeDialog:undefined, closeAllDialogs:undefined,
    openDialogs:[], DialogIsOpen:undefined,
    DialogIsFrontmost:undefined, bringDialogToFront:undefined,
  })

  export function useDialogContext () {
    return useContext(AIM_DialogContext)
  }

/**** fullsized ****/

  export function fullsized (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
      )

      return html`<div class="aim-component fullsized ${Classes ?? ''}" ...${RestProps}>
        ${ContentList}
      </>`
    })
  }

  installStylesheetFor('aim-component.fullsized',`
    .aim-component.fullsized {
      flex:1 0 auto;
      left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
    }
    .aim-component.fullsized > * {
      position:absolute;
      left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
    }
  `)

/**** centered ****/

  export function centered (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
      )

      return html`<div class="aim-component centered ${Classes ?? ''}" ...${RestProps}>
        ${ContentList}
      </>`
    })
  }

  installStylesheetFor('aim-component.centered',`
    .aim-component.centered {
      display:flex ! important; flex-flow:column nowrap ! important;
        align-items:center ! important; justify-content:center ! important;
      flex:1 0 auto;
      left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
    }
    .aim-component.centered > * {
      position:relative; flex:0 0 auto;
    }
  `)

/**** horizontal ****/

  export function horizontal (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Style, Gap, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalOrdinal ('gap')
      )
      Gap = Gap ?? 0

      return html`<div class="aim-component horizontal ${Classes ?? ''}"
        style="gap:${Gap}px; ${Style ?? ''}" ...${RestProps}
      >${ContentList}</>`
    })
  }

  installStylesheetFor('aim-component.horizontal',`
    .aim-component.horizontal {
      display:flex ! important; flex-flow:row nowrap ! important;
        align-items:center;
    }
    .aim-component.horizontal > * {
      position:relative; flex:0 0 auto;
    }
  `)

/**** vertical ****/

  export function vertical (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Style, Gap, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalOrdinal ('gap')
      )
      Gap = Gap ?? 0

      return html`<div class="aim-component vertical ${Classes ?? ''}"
        style="gap:${Gap}px; ${Style ?? ''}" ...${RestProps}
      >${ContentList}</>`
    })
  }

  installStylesheetFor('aim-component.vertical',`
    .aim-component.vertical {
      display:flex ! important; flex-flow:column nowrap !important;
        align-items:start;
    }
    .aim-component.vertical > * {
      position:relative; flex:0 0 auto;
    }
  `)

/**** tabular (column classes may be "expanding" or "shrinking", see below) ****/

  export function tabular (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Columns, RowGap, ColGap, ColClasses, RestProps, ContentList
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalCardinal('columns'),
        optionalOrdinal ('rowgap'),
        optionalOrdinal ('colgap'),
        optionalTextline('columnclasses'),                    // space-separated
      )

      Columns    = Columns    ?? 2
      RowGap     = RowGap     ?? 0
      ColGap     = ColGap     ?? 0
      ColClasses = ColClasses ?? ''

    /**** prepare for explicit ColSpans ****/

      function ColSpanOfCell (TableCell:VNode):AIM_Ordinal {
        if (typeof TableCell === 'string') {
          return 1
        } else {
          let ColSpan = TableCell.props['colspan']
          return (ValueIsOrdinal(ColSpan) ? ColSpan : 1)
        }
      }

    /**** arrange contents in a tabular manner ****/

      ContentList = toChildArray(ContentList).filter(
        (Cell:VNode) => (Cell.type != null) || (Cell.trim() !== '')
      )
      const ContentCount = ContentList.length

      const RowList:VNode[][] = [[]]; let RowIndex = 0, CellIndex = 0

      ContentList.forEach((Cell:VNode, Index:number) => {
        RowList[RowIndex].push(Cell)

        CellIndex += ColSpanOfCell(Cell)
        if ((CellIndex >= Columns) && (Index < ContentCount-1)) {
          RowList.push([]); RowIndex++; CellIndex = 0
        }
      })

      const ColGroup = (ColClasses.trim() === ''
        ? ''
        : html`<colgroup>${ColClasses.split(' ').map((Class:string) => html`<col class="${Class}"/>`)}</>`
      )

    /**** now render the whole table ****/

      return html`<table class="aim-component tabular ${Classes ?? ''}" style="
        ${Style ?? ''};
        border-spacing:${ColGap}px ${RowGap}px;
        margin:-${RowGap}px -${ColGap}px -${RowGap}px -${ColGap}px
      " ...${RestProps}
      >${ColGroup}<tbody>
        ${(ContentCount > 0) && RowList.map((Row:VNode[],i:number) => html`<tr>
          ${Row.map(
            (Cell:VNode) => html`<td colspan=${ColSpanOfCell(Cell)}>${Cell}</>`)
          }
        </tr>`)}
      </tbody></table>`
    })
  }

  installStylesheetFor('aim-component.tabular',`
    .aim-component.tabular {
      display:table ! important;
      border:none; border-collapse:separate; border-spacing:0px;
    }
    .aim-component.tabular > tbody {
      position:relative;
      vertical-align:top;
    }
    .aim-component.tabular > tbody > tr > td {
      display:table-cell;
      margin:0px; padding:0px;
    }

    .aim-component.tabular > colgroup > col.expanding { width:100% }
    .aim-component.tabular > colgroup > col.shrinking { width:1px }
  `)

/**** selective ****/

  export function selective (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, activeIndex, RestProps, ContentList
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalOrdinal ('activeindex'),
      )

      ContentList = toChildArray(ContentList).filter(
        (Content:VNode) => (typeof Content !== 'string') || (Content.trim() !== '')
      )
      const ContentCount = ContentList.length

      activeIndex = (
        ContentCount === 0
        ? 0
        : Math.max(0, Math.min(activeIndex ?? 0,ContentCount-1))
      )

      return html`<div class="aim-component selective ${Classes ?? ''}"
        ...${RestProps}>${ContentList[activeIndex]}</>`
    })
  }

  installStylesheetFor('aim-component.selective',`
    .aim-component.selective {
      display:flex ! important; flex-flow:column nowrap ! important;
        align-items:stretch ! important; justify-content:stretch ! important;
      flex:1 0 auto;
    }
    .aim-component.selective > * {
      display:block; position:relative;
      left:0px; top:0px; right:auto; bottom:auto; width:100%; height:100%;
    }
  `)

/**** stacked ****/

  export function stacked (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
      )

      return html`<div class="aim-component stacked ${Classes ?? ''}" ...${RestProps}>
        ${ContentList}
      </>`
    })
  }

  installStylesheetFor('aim-component.stacked',`
    .aim-component.stacked > *:first-child {
      position:relative;
      left:0px; top:0px; right:auto; bottom:auto; width:auto; height:auto;
    }
    .aim-component.stacked > *:not(:first-child) {
      position:absolute;
    }
  `)

/**** Dummy ****/

  export function Dummy (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, visiblePattern, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('value'),
        optionalBoolean ('visiblepattern'),
      )

      return html`<div
        class="aim-component dummy ${visiblePattern ? 'visible-pattern' : ''} ${Classes ?? ''}"
        ...${RestProps} dangerouslySetInnerHTML=${{__html:Value ?? ''}}
      />`
    })
  }

  installStylesheetFor('aim-component.dummy',`
    .aim-component.dummy.visible-pattern {
      background-image:repeating-linear-gradient(-45deg,
        rgba(222,222,222, 1) 0px, rgba(222,222,222, 1) 4px,
        rgba(0,0,0, 0) 4px, rgba(0,0,0, 0) 8px
      ); background-size:11.31px 11.31px;
    }
  `)

/**** Outline ****/

  export function Outline (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
      )

      return html`<div class="aim-component outline ${Classes ?? ''}" ...${RestProps}/>`
    })
  }

  installStylesheetFor('aim-component.outline',`
    .aim-component.outline {
      outline:dotted 1px blue;
      outline-offset:2px;
    }
  `)

/**** Spacer ****/

  export function Spacer (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Style, Width, Height, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalOrdinal ('width'),
        optionalOrdinal('height'),
      )

      Style = (
        (Width  == null ? '' :  `width:${Width}px;`)  +
        (Height == null ? '' : `height:${Height}px;`) +
        (Style ?? '')
      )
      return html`<div class="aim-component spacer ${Classes ?? ''}"
        style=${Style} ...${RestProps}/>`
    })
  }

/**** expandingSpacer ****/

  export function expandingSpacer (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Style, Width, Height, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalOrdinal ('width'),
        optionalOrdinal('height'),
      )

      Style = (
        (Width  == null ? '' :  `width:${Width}px;`)  +
        (Height == null ? '' : `height:${Height}px;`) +
        (Style ?? '')
      )
      return html`<div class="aim-component expanding-spacer ${Classes ?? ''}"
        style=${Style} ...${RestProps}/>`
    })
  }

  installStylesheetFor('aim-component.expanding-spacer',`
    .aim-component.expanding-spacer {
      flex:1 0 auto ! important;
    }
  `)

/**** horizontalSeparator ****/

  export function horizontalSeparator (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
      )
      return html`<div class="aim-component horizontal-separator ${Classes ?? ''}" ...${RestProps}/>`
    })
  }

  installStylesheetFor('aim-component.horizontal-separator',`
    .aim-component.horizontal-separator {
      flex:1 0 auto;
      width:100%; min-width:1px; min-height:1px;
    }
    .aim-component.horizontal-separator::before {
      content: "";
      position:absolute; left:0px; right:0px; width:100%; height:1px;
      top:50%; transform:translateY(-50%);
      background:gray;
    }
  `)

/**** verticalSeparator ****/

  export function verticalSeparator (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
      )
      return html`<div class="aim-component vertical-separator ${Classes ?? ''}" ...${RestProps}/>`
    })
  }

  installStylesheetFor('aim-component.vertical-separator',`
    .aim-component.vertical-separator {
      flex:1 0 auto;
      height:100%; min-width:1px; min-height:1px;
    }
    .aim-component.vertical-separator::before {
      content: "";
      position:absolute; top:0px; bottom:0px; width:1px; height:100%;
      left:50%; transform:translateX(-50%);
      background:gray;
    }
  `)

/**** plainTextlineView ****/

  function plainTextlineView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('value'),
      )

      return html`<div class=${Classes ?? ''} ...${RestProps}>
        ${Value ?? ContentList}
      </>`
    })
  }

/**** Title ****/

  export function Title (PropSet:Indexable):any {
    PropSet = { ...PropSet, 'class':`aim-component title ${PropSet.class ?? ''}` }
    return plainTextlineView(PropSet)
  }

  installStylesheetFor('aim-component.title',`
    .aim-component.title {
      font-size:22px; font-weight:bold; line-height:32px;
      overflow:hidden; text-overflow:ellipsis;
    }
  `)

/**** Subtitle ****/

  export function Subtitle (PropSet:Indexable):any {
    PropSet = { ...PropSet, 'class':`aim-component subtitle ${PropSet.class ?? ''}` }
    return plainTextlineView(PropSet)
  }

  installStylesheetFor('aim-component.subtitle',`
    .aim-component.subtitle {
      font-size:18px; font-weight:bold; line-height:27px;
      overflow:hidden; text-overflow:ellipsis;
    }
  `)

/**** Label ****/

  export function Label (PropSet:Indexable):any {
    PropSet = { ...PropSet, 'class':`aim-component label ${PropSet.class ?? ''}` }
    return plainTextlineView(PropSet)
  }

  installStylesheetFor('aim-component.label',`
    .aim-component.label {
      height:30px;
      font-size:14px; font-weight:bold; line-height:30px;
      overflow:hidden; text-overflow:ellipsis;
    }
  `)

/**** plainTextView ****/

  function plainTextView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('value'),
      )

      return html`<div class=${Classes ?? ''} ...${RestProps}>
        ${Value ?? ContentList}
      </>`
    })
  }

/**** Description ****/

  export function Description (PropSet:Indexable):any {
    PropSet = { ...PropSet, 'class':`aim-component description ${PropSet.class ?? ''}` }
    return plainTextlineView(PropSet)
  }

  installStylesheetFor('aim-component.description',`
    .aim-component.description {
      font-size:14px; font-weight:normal; line-height:21px;
      overflow:hidden; text-overflow:ellipsis;
    }
  `)

/**** Fineprint ****/

  export function Fineprint (PropSet:Indexable):any {
    PropSet = { ...PropSet, 'class':`aim-component fineprint ${PropSet.class ?? ''}` }
    return plainTextlineView(PropSet)
  }

  installStylesheetFor('aim-component.fineprint',`
    .aim-component.fineprint {
      font-size:12px; font-weight:normal; line-height:18px;
      overflow:hidden; text-overflow:ellipsis;
    }
  `)

/**** TextView[WithFileDrop] ****/

  export function TextView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, preformatted, RestProps ] = parsedPropSet(PropSet,
        optionalTextline      ('class'),
        optionalText          ('value'),
        optionalBoolean('preformatted'),
      )
      return html`<div class="aim-component textview ${Classes ?? ''} ${preformatted ? 'preformatted' : ''}"
        ...${RestProps}>${Value ?? ''}</>`
    })
  }

  export function TextViewWithFileDrop (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, preformatted, disabled, onFileDrop, RestProps ] = parsedPropSet(PropSet,
        optionalTextline      ('class'),
        optionalText          ('value'),
        optionalBoolean('preformatted'),
        optionalBoolean    ('disabled'),
        optionalFunction     ('ondrop'),
      )

      const _onDrop = useCallback((acceptableFiles:any[], Event:Event) => {
        if (acceptableFiles.length > 0) {
          const TextFile = acceptableFiles[0]

          const TextReader = new FileReader()
          TextReader.onload = (Event:Indexable) => {
            const droppedValue = Event.target?.result as string
            executeCallback(
              'TextView callback "onDrop"', onFileDrop, droppedValue,Event
            )
          }
          TextReader.readAsText(TextFile)
        }
      }, [ onFileDrop ])

      const withFileDrop = (onFileDrop != null) && ! disabled
      const [ onDragEnter,onDragOver,onDragLeave,onDrop ] = useFileDropCatcher({
        accept:'text/*', multiple:false, onDrop:_onDrop
      })

      return html`<div class="aim-component textview ${Classes ?? ''} ${preformatted ? 'preformatted' : ''}"
        ...${RestProps}
        onDragEnter=${withFileDrop && onDragEnter}
        onDragOver=${withFileDrop && onDragOver}
        onDragLeave=${withFileDrop && onDragLeave}
        onDrop=${withFileDrop && onDrop}
      >${Value ?? ''}</>`
    })
  }

  installStylesheetFor('aim-component.textview',`
    .aim-component.textview {
      overflow:auto;
/*    font-family:"Segoe UI",Tahoma,Geneva,Verdana,Arial,Helvetica,sans-serif; */
      font-size:14px; font-weight:normal; line-height:21px;
    }
    .aim-component.textview.preformatted {
      white-space:pre;
      font-family:"Courier New",Courier,"Lucida Sans Typewriter","Lucida Console",Monaco,Consolas,monospace;
      font-size:14px; font-weight:normal; line-height:21px;
    }
  `)

/**** HTMLView[WithFileDrop] ****/

  export function HTMLView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('value'),
      )

      return html`<div class="aim-component htmlview ${Classes ?? ''}" ...${RestProps}
        dangerouslySetInnerHTML=${{__html:Value ?? ''}}
      />`
    })
  }

  export function HTMLViewWithFileDrop (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, disabled, onFileDrop, RestProps ] = parsedPropSet(PropSet,
        optionalTextline  ('class'),
        optionalText      ('value'),
        optionalBoolean('disabled'),
        optionalFunction ('ondrop'),
      )

      const _onDrop = useCallback((acceptableFiles:any[], Event:Event) => {
        if (acceptableFiles.length > 0) {
          const HTMLFile = acceptableFiles[0]

          const HTMLReader = new FileReader()
          HTMLReader.onload = (Event:Indexable) => {
            const droppedValue = Event.target?.result as string
            executeCallback(
              'HTMLView callback "onDrop"', onFileDrop, droppedValue,Event
            )
          }
          HTMLReader.readAsText(HTMLFile)
        }
      }, [ onFileDrop ])

      const withFileDrop = (onFileDrop != null) && ! disabled
      const [ onDragEnter,onDragOver,onDragLeave,onDrop ] = useFileDropCatcher({
        accept:'text/html', multiple:false, onDrop:_onDrop
      })

      return html`<div class="aim-component htmlview ${Classes ?? ''}"
        ...${RestProps}
        onDragEnter=${withFileDrop && onDragEnter}
        onDragOver=${withFileDrop && onDragOver}
        onDragLeave=${withFileDrop && onDragLeave}
        onDrop=${withFileDrop && onDrop}
        dangerouslySetInnerHTML=${{__html:Value ?? ''}}
      />`
    })
  }

  installStylesheetFor('aim-component.htmlview',`
    .aim-component.htmlview {
      overflow:auto;
      font-size:14px; font-weight:normal; line-height:21px;
    }
  `)

/**** MarkdownView[WithFileDrop] ****/

// don't forget  <link rel="stylesheet" href="/css/katex.min.css"/>

  export const MarkdownRenderer = new Marked()
    MarkdownRenderer.setOptions({
      gfm:true, breaks:true, pedantic:false, smartypants:false
    })

    MarkdownRenderer.use(markedKatex({
      throwOnError:false, /*nonStandard:true,*/
    }))

    MarkdownRenderer.use(markedHighlight({
      emptyLangClass:'hljs',
      langPrefix:    'hljs language-',                       // CSS class prefix
      highlight(Code:unknown, Language:unknown, Info:unknown) {
        Language = hljs.getLanguage(Language) ? Language : 'plaintext'
        return hljs.highlight(Code, { language:Language }).value
      }
    }))
  export function MarkdownView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('value'),
      )

      const HTMLContents = useMemo(
        () => MarkdownRenderer.parse(Value ?? ''),[Value]
      )

      return html`<div class="aim-component markdownview ${Classes ?? ''}" ...${RestProps}
        dangerouslySetInnerHTML=${{__html:HTMLContents}}
      />`
    })
  }

  export function MarkdownViewWithFileDrop (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, disabled, onFileDrop, RestProps ] = parsedPropSet(PropSet,
        optionalTextline  ('class'),
        optionalText      ('value'),
        optionalBoolean('disabled'),
        optionalFunction ('ondrop'),
      )

      const HTMLContents = useMemo(
        () => MarkdownRenderer.parse(Value ?? ''),[Value]
      )

      const _onDrop = useCallback((acceptableFiles:any[], Event:Event) => {
        if (acceptableFiles.length > 0) {
          const MarkdownFile = acceptableFiles[0]

          const MarkdownReader = new FileReader()
          MarkdownReader.onload = (Event:Indexable) => {
            const droppedValue = Event.target?.result as string
            executeCallback(
              'MarkdownView callback "onDrop"', onFileDrop, droppedValue,Event
            )
          }
          MarkdownReader.readAsText(MarkdownFile)
        }
      }, [ onFileDrop ])

      const withFileDrop = (onFileDrop != null) && ! disabled
      const [ onDragEnter,onDragOver,onDragLeave,onDrop ] = useFileDropCatcher({
        accept:'text/markdown', multiple:false, onDrop:_onDrop
      })

      return html`<div class="aim-component markdownview ${Classes ?? ''}"
        ...${RestProps}
        onDragEnter=${withFileDrop && onDragEnter}
        onDragOver=${withFileDrop && onDragOver}
        onDragLeave=${withFileDrop && onDragLeave}
        onDrop=${withFileDrop && onDrop}
        dangerouslySetInnerHTML=${{__html:HTMLContents}}
      />`
    })
  }

  installStylesheetFor('aim-component.markdownview',`
    .aim-component.markdownview {
      overflow:auto;
      font-size:14px; font-weight:normal; line-height:21px;
    }

    .aim-component.markdownview > h1 { font-size:22px; font-weight:bold; line-height:1.5; margin:0px }
    .aim-component.markdownview > h2 { font-size:20px; font-weight:bold; line-height:1.5; margin:0px }
    .aim-component.markdownview > h3 { font-size:18px; font-weight:bold; line-height:1.5; margin:0px }
    .aim-component.markdownview > h4 { font-size:16px; font-weight:bold; line-height:1.5; margin:0px }
    .aim-component.markdownview > h5 { font-size:15px; font-weight:bold; line-height:1.5; margin:0px }
    .aim-component.markdownview > h6 { font-size:14px; font-weight:bold; line-height:1.5; margin:0px }

    .aim-component.markdownview > h1:not(:first-child) { margin-top:11px }
    .aim-component.markdownview > h2:not(:first-child) { margin-top:10px }
    .aim-component.markdownview > h3:not(:first-child) { margin-top:9px }
    .aim-component.markdownview > h4:not(:first-child) { margin-top:8px }
    .aim-component.markdownview > h5:not(:first-child) { margin-top:8px }
    .aim-component.markdownview > h6:not(:first-child) { margin-top:7px }

    .aim-component.markdownview > p { font-size:14px; font-weight:normal; line-height:1.5; margin:0px }
    .aim-component.markdownview > p:not(:first-child) { margin-top:7px }

    .aim-component.markdownview > ul { font-size:14px; font-weight:normal; line-height:1.5; margin:0px }
    .aim-component.markdownview > ul:not(:first-child) { margin-top:7px }

    .aim-component.markdownview > ol { font-size:14px; font-weight:normal; line-height:1.5; margin:0px }
    .aim-component.markdownview > ol:not(:first-child) { margin-top:7px }

    .aim-component.markdownview > li { margin-left:20px }
    .aim-component.markdownview > ul, .aim-markdownview > .aim-content ol { padding-left:0px }

    .aim-component.markdownview > blockquote {
      margin:7px 0px 0px 10px;
      padding:0px 0px 0px 6px;
      border:none; border-left:solid 4px lightgray;
    }

    .aim-component.markdownview > code {
      font-family:Menlo,Courier,monospace;
      font-size:13px; font-weight:normal; line-height:1.5; margin:0px;
      padding:2px; background-color:#EEEEEE;
    }

    .aim-component.markdownview > pre { background-color:#EEEEEE; padding:2px 0px 2px 6px }
    .aim-component.markdownview > pre:not(:first-child) { margin-top:7px }
    .aim-component.markdownview > pre > code { padding:0px }

  /**** Syntax Highlighing ****/

    .hljs {
      display:block;
      overflow-x:auto;
      padding:0.5em;
      background:#f0f0f0;
      color:#444444;
    }

    .hljs-comment, .hljs-quote                     { font-style:italic;  color:#999988 }
    .hljs-keyword, .hljs-selector-tag, .hljs-subst { font-weight:bold;   color:#333333 }
    .hljs-string,  .hljs-doctag                    { color:#dd1144 }
    .hljs-number                                   { color:#009999 }
    .hljs-title, .hljs-section, .hljs-selector-id  { font-weight:bold;   color:#990000 }
    .hljs-class .hljs-title, .hljs-type            { font-weight:bold;   color:#445588 }
    .hljs-variable, .hljs-template-variable        { color:#336699 }
    .hljs-attr                                     { color:#007700 }
    .hljs-tag, .hljs-name                          { font-weight:normal; color:#000080}
    .hljs-regexp                                   { color:#009926 }
    .hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta, .hljs-selector-pseudo { color:#990073 }
    .hljs-built_in, .hljs-builtin-name             { color:#0086b3 }
    .hljs-deletion                                 { background:#ffdddd }
    .hljs-addition                                 { background:#ddffdd }
    .hljs-emphasis                                 { font-style:italic }
    .hljs-strong                                   { font-weight:bold }
    .hljs.language-html, .hljs.language-xml        { color:#333333 }
    .hljs.language-css .hljs-selector-class,
    .hljs.language-css .hljs-selector-tag,
    .hljs.language-css .hljs-attribute             { color:#1e347b }
    .hljs.language-javascript .hljs-keyword        { color:#0000aa }
    .hljs.language-typescript .hljs-keyword        { color:#0000aa }
    .hljs.language-java .hljs-keyword              { color:#bb9966 }
    .hljs.language-json .hljs-attribute            { color:#0000aa }
  `)

/**** ImageView[WithFileDrop] ****/

  export const AIM_ImageScalings = ['none','stretch','cover','contain']
  export type  AIM_ImageScaling  = typeof AIM_ImageScalings[number]

  export const AIM_ImageAlignments = [
    'left top','center top','right top','left center','center center',
    'right center','left bottom','center bottom','right bottom'
  ]
  export type AIM_ImageAlignment = typeof AIM_ImageAlignments[number]


  function ValueIsImageScaling (Value:any):boolean {
    return ValueIsOneOf(Value,AIM_ImageScalings)
  }

  function ValueIsImageAlignment (Value:any):boolean {
    return ValueIsOneOf(Value,AIM_ImageAlignments)
  }

  export function ImageView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Value, ImageScaling, ImageAlignment, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline  ('class'),
        optionalText      ('style'),
        optionalURL       ('value'),
        optionalValue   ('scaling',ValueIsImageScaling),
        optionalValue ('alignment',ValueIsImageAlignment),
      )

      if (Value == null) {
        return html`<${centered} ...${RestProps} style=${Style ?? ''}>
          <${Description} value="(empty)"/>
        </>`
      } else {
        return html`<img class="aim-component imageview ${Classes ?? ''}" src=${Value ?? ''} style="
          object-fit:${ImageScaling ?? 'contain'};
          object-position:${ImageAlignment ?? 'center center'}; ${Style}
        " ...${RestProps}
        />`
      }
    })
  }

  export function ImageViewWithFileDrop (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Value, ImageScaling, ImageAlignment,
        disabled, onImageDrop, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline  ('class'),
        optionalText      ('style'),
        optionalURL       ('value'),
        optionalValue   ('scaling',ValueIsImageScaling),
        optionalValue ('alignment',ValueIsImageAlignment),
        optionalBoolean('disabled'),
        optionalFunction ('ondrop'),
      )

      const _onDrop = useCallback((acceptableFiles:any[], Event:Event) => {
        if (acceptableFiles.length > 0) {
          const ImageFile = acceptableFiles[0]

          const ImageReader = new FileReader()
          ImageReader.onload = (Event:Indexable) => {
            const droppedValue = Event.target?.result as string
            executeCallback(
              'ImageView callback "onDrop"', onImageDrop, droppedValue,Event
            )
          }
          ImageReader.readAsDataURL(ImageFile)
        }
      }, [ onImageDrop ])

      const withFileDrop = (onImageDrop != null) && ! disabled
      const [ onDragEnter,onDragOver,onDragLeave,onDrop ] = useFileDropCatcher({
        accept:'image/bmp, image/tiff, image/gif, image/jpeg, image/png, image/webp',
        multiple:false, onDrop:_onDrop
      })

      if (Value == null) {
        return html`<${centered} ...${RestProps} style=${Style ?? ''}
          onDragEnter=${withFileDrop && onDragEnter}
          onDragOver=${withFileDrop && onDragOver}
          onDragLeave=${withFileDrop && onDragLeave}
          onDrop=${withFileDrop && onDrop}
        >
          <${Description} value="(empty)"/>
        </>`
      } else {
        return html`<img class="aim-component imageview ${Classes ?? ''}" src=${Value ?? ''} style="
          object-fit:${ImageScaling ?? 'contain'};
          object-position:${ImageAlignment ?? 'center center'}; ${Style}
        " ...${RestProps}
          onDragEnter=${withFileDrop && onDragEnter}
          onDragOver=${withFileDrop && onDragOver}
          onDragLeave=${withFileDrop && onDragLeave}
          onDrop=${withFileDrop && onDrop}
        />`
      }
    })
  }

  installStylesheetFor('aim-component.imageview',`
    .aim-component.imageview {
      object-fit:contain; object-position:center;
    }
  `)

/**** SVGView ****/

  export function SVGView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Value, ImageScaling, ImageAlignment, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline ('class'),
        optionalText     ('style'),
        optionalURL      ('value'),
        optionalValue  ('scaling',ValueIsImageScaling),
        optionalValue('alignment',ValueIsImageAlignment),
      )

      const DataURL = useMemo(() => 'image/svg+xml;base64,' + btoa(Value ?? ''))

      if (Value == null) {
        return html`<${centered} ...${RestProps} style=${Style ?? ''}>
          <${Description} value="(empty)"/>
        </>`
      } else {
        return html`<img class="aim-component imageview ${Classes ?? ''}" src=${DataURL} style="
          object-fit:${ImageScaling ?? 'contain'};
          object-position:${ImageAlignment ?? 'center center'}; ${Style}
        " ...${RestProps}
        />`
      }
    })
  }

  export function SVGViewWithFileDrop (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Value, ImageScaling, ImageAlignment,
        disabled, onImageDrop, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline  ('class'),
        optionalText      ('style'),
        optionalURL       ('value'),
        optionalValue   ('scaling',ValueIsImageScaling),
        optionalValue ('alignment',ValueIsImageAlignment),
        optionalBoolean('disabled'),
        optionalFunction ('ondrop'),
      )

      const DataURL = useMemo(() => 'image/svg+xml;base64,' + btoa(Value ?? ''))

      const _onDrop = useCallback((acceptableFiles:any[], Event:Event) => {
        if (acceptableFiles.length > 0) {
          const ImageFile = acceptableFiles[0]

          const ImageReader = new FileReader()
          ImageReader.onload = (Event:Indexable) => {
            const droppedValue = Event.target?.result as string
            executeCallback(
              'SVGView callback "onDrop"', onImageDrop, droppedValue,Event
            )
          }
          ImageReader.readAsDataURL(ImageFile)
        }
      }, [ onImageDrop ])

      const withFileDrop = (onImageDrop != null) && ! disabled
      const [ onDragEnter,onDragOver,onDragLeave,onDrop ] = useFileDropCatcher({
        accept:'image/svg+xml', multiple:false, onDrop:_onDrop
      })

      if (Value == null) {
        return html`<${centered} ...${RestProps} style=${Style ?? ''}
          onDragEnter=${withFileDrop && onDragEnter}
          onDragOver=${withFileDrop && onDragOver}
          onDragLeave=${withFileDrop && onDragLeave}
          onDrop=${withFileDrop && onDrop}
        >
          <${Description} value="(empty)"/>
        </>`
      } else {
        return html`<img class="aim-component imageview ${Classes ?? ''}" src=${DataURL} style="
          object-fit:${ImageScaling ?? 'contain'};
          object-position:${ImageAlignment ?? 'center center'}; ${Style}
        " ...${RestProps}
          onDragEnter=${withFileDrop && onDragEnter}
          onDragOver=${withFileDrop && onDragOver}
          onDragLeave=${withFileDrop && onDragLeave}
          onDrop=${withFileDrop && onDrop}
        />`
      }
    })
  }

  installStylesheetFor('aim-component.svgview',`
    .aim-component.svgview {
      object-fit:contain; object-position:center;
    }
  `)

/**** WebView ****/

  export const AIM_DefaultSandboxPermissions = (
    'allow-downloads allow-forms allow-modals allow-orientation-lock ' +
    'allow-pointer-lock allow-popups allow-same-origin allow-scripts'
  )

  export const AIM_ReferrerPolicies = [
    'no-referrer','no-referrer-when-downgrade','origin','origin-when-cross-origin',
    'same-origin', 'strict-origin', 'strict-origin-when-cross-origin',
    'unsafe-url'
  ]
  export type AIM_ReferrerPolicy = typeof AIM_ReferrerPolicies[number]

  function ValueIsReferrerPolicy (Value:any):boolean {
    return ValueIsOneOf(Value,AIM_ReferrerPolicies)
  }

  export function WebView (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Value, Permissions, allowsFullScreen,
        SandboxPermissions, ReferrerPolicy, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline         ('class'),
        optionalURL              ('value'),
        optionalTextline         ('allow'),
        optionalBoolean('allowfullscreen'),
        optionalTextline       ('sandbox'),
        optionalValue   ('referrerpolicy',ValueIsReferrerPolicy),
      )

      return html`<iframe class="aim-component webview ${Classes ?? ''}" src=${Value ?? ''}
        allow=${Permissions} allowfullscreen=${allowsFullScreen}
        sandbox=${SandboxPermissions} referrerpolicy=${ReferrerPolicy}
        ...${RestProps}
      />`
    })
  }

  installStylesheetFor('aim-component.webview',`
    .aim-component.webview {
      overflow:auto;
    }
  `)

/**** Icon ****/

  export function Icon (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Value, Color, active, disabled, onClick, RestProps, ContentList
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalURL     ('value'),
        optionalColor   ('color'),
        optionalBoolean ('active'),
        optionalBoolean ('disabled'),
        optionalFunction('onclick'),
      )
      Value = Value ?? `${IconFolder}/circle-information.png`
      Color = Color ?? 'black'

      const _onClick = useCallback((Event:Event):void => {
        if (disabled) { return consumingEvent(Event) }
        executeCallback('Icon callback "onClick"',onClick,Event)
      }, [ disabled, onClick ])

      const Cursor = (
        disabled ? 'not-allowed' : (onClick == null) ? 'auto' : 'pointer'
      )

      return html`<div
        class="aim-component icon ${disabled ? 'disabled' : ''} ${active ? 'active' : ''} ${Classes ?? ''}"
        onClick=${_onClick} ...${RestProps}
      >
        <div style="
          -webkit-mask-image:url(${Value}); mask-image:url(${Value});
          background-color:${Color};
          cursor:${Cursor};
        "/>
      </>`
    })
  }

  installStylesheetFor('aim-component.icon',`
    .aim-component.icon {
      width:24px ! important; height:24px ! important;
    }

    .aim-component.icon > div {
      width:24px; height:24px;
      overflow:hidden; pointer-events:auto;
      -webkit-mask-size:contain;           mask-size:contain;
      -webkit-mask-position:center center; mask-position:center center;
    }

    .aim-component.icon.active {
      background:#e8f0ff;
      outline:solid 2px lightgray; border-radius:4px;
    }
  `)

/**** FAIcon ****/

  export const AIM_FAIconNames = [
// modified version from https://gist.github.com/zwinnie/3ed8e7970240962bc29227533c3ae047
    'fa-500px', 'fa-address-book', 'fa-address-book-o', 'fa-address-board',
    'fa-address-board-o', 'fa-adjust', 'fa-adn', 'fa-align-center',
    'fa-align-justify', 'fa-align-left', 'fa-align-right', 'fa-amazon',
    'fa-ambulance', 'fa-american-sign-language-interpreting', 'fa-anchor',
    'fa-android', 'fa-angellist', 'fa-angle-double-down',
    'fa-angle-double-left', 'fa-angle-double-right', 'fa-angle-double-up',
    'fa-angle-down', 'fa-angle-left', 'fa-angle-right', 'fa-angle-up',
    'fa-apple', 'fa-archive', 'fa-area-chart', 'fa-arrow-circle-down',
    'fa-arrow-circle-left', 'fa-arrow-circle-o-down', 'fa-arrow-circle-o-left',
    'fa-arrow-circle-o-right', 'fa-arrow-circle-o-up', 'fa-arrow-circle-right',
    'fa-arrow-circle-up', 'fa-arrow-down', 'fa-arrow-left', 'fa-arrow-right',
    'fa-arrow-up', 'fa-arrows', 'fa-arrows-alt', 'fa-arrows-h', 'fa-arrows-v',
    'fa-asl-interpreting', 'fa-assistive-listening-systems', 'fa-asterisk',
    'fa-at', 'fa-audio-description', 'fa-automobile', 'fa-backward',
    'fa-balance-scale', 'fa-ban', 'fa-bandcamp', 'fa-bank', 'fa-bar-chart',
    'fa-bar-chart-o', 'fa-barcode', 'fa-bars', 'fa-bath', 'fa-bathtub',
    'fa-battery', 'fa-battery-0', 'fa-battery-1', 'fa-battery-2',
    'fa-battery-3', 'fa-battery-4', 'fa-battery-empty', 'fa-battery-full',
    'fa-battery-half', 'fa-battery-quarter', 'fa-battery-three-quarters',
    'fa-bed', 'fa-beer', 'fa-behance', 'fa-behance-square', 'fa-bell',
    'fa-bell-o', 'fa-bell-slash', 'fa-bell-slash-o', 'fa-bicycle',
    'fa-binoculars', 'fa-birthday-cake', 'fa-bitbucket', 'fa-bitbucket-square',
    'fa-bitcoin', 'fa-black-tie', 'fa-blind', 'fa-bluetooth', 'fa-bluetooth-b',
    'fa-bold', 'fa-bolt', 'fa-bomb', 'fa-book', 'fa-bookmark', 'fa-bookmark-o',
    'fa-braille', 'fa-briefcase', 'fa-btc', 'fa-bug', 'fa-building',
    'fa-building-o', 'fa-bullhorn', 'fa-bullseye', 'fa-bus', 'fa-buysellads',
    'fa-cab', 'fa-calculator', 'fa-calendar', 'fa-calendar-check-o',
    'fa-calendar-minus-o', 'fa-calendar-o', 'fa-calendar-plus-o',
    'fa-calendar-times-o', 'fa-camera', 'fa-camera-retro', 'fa-car',
    'fa-caret-down', 'fa-caret-left', 'fa-caret-right',
    'fa-caret-square-o-down', 'fa-caret-square-o-left',
    'fa-caret-square-o-right', 'fa-caret-square-o-up', 'fa-caret-up',
    'fa-cart-arrow-down', 'fa-cart-plus', 'fa-cc', 'fa-cc-amex',
    'fa-cc-diners-club', 'fa-cc-discover', 'fa-cc-jcb', 'fa-cc-masterboard',
    'fa-cc-paypal', 'fa-cc-stripe', 'fa-cc-visa', 'fa-certificate', 'fa-chain',
    'fa-chain-broken', 'fa-check', 'fa-check-circle', 'fa-check-circle-o',
    'fa-check-square', 'fa-check-square-o', 'fa-chevron-circle-down',
    'fa-chevron-circle-left', 'fa-chevron-circle-right', 'fa-chevron-circle-up',
    'fa-chevron-down', 'fa-chevron-left', 'fa-chevron-right', 'fa-chevron-up',
    'fa-child', 'fa-chrome', 'fa-circle', 'fa-circle-o', 'fa-circle-o-notch',
    'fa-circle-thin', 'fa-clipboard', 'fa-clock-o', 'fa-clone', 'fa-close',
    'fa-cloud', 'fa-cloud-download', 'fa-cloud-upload', 'fa-cny', 'fa-code',
    'fa-code-fork', 'fa-codepen', 'fa-codiepie', 'fa-coffee', 'fa-cog',
    'fa-cogs', 'fa-columns', 'fa-comment', 'fa-comment-o', 'fa-commenting',
    'fa-commenting-o', 'fa-comments', 'fa-comments-o', 'fa-compass',
    'fa-compress', 'fa-connectdevelop', 'fa-contao', 'fa-copy', 'fa-copyright',
    'fa-creative-commons', 'fa-credit-board', 'fa-credit-board-alt', 'fa-crop',
    'fa-crosshairs', 'fa-css3', 'fa-cube', 'fa-cubes', 'fa-cut', 'fa-cutlery',
    'fa-dashboard', 'fa-dashcube', 'fa-database', 'fa-deaf', 'fa-deafness',
    'fa-dedent', 'fa-delicious', 'fa-desktop', 'fa-deviantart', 'fa-diamond',
    'fa-digg', 'fa-dollar', 'fa-dot-circle-o', 'fa-download', 'fa-dribbble',
    'fa-drivers-license', 'fa-drivers-license-o', 'fa-dropbox', 'fa-drupal',
    'fa-edge', 'fa-edit', 'fa-eercast', 'fa-eject', 'fa-ellipsis-h',
    'fa-ellipsis-v', 'fa-empire', 'fa-envelope', 'fa-envelope-o',
    'fa-envelope-open', 'fa-envelope-open-o', 'fa-envelope-square', 'fa-envira',
    'fa-eraser', 'fa-etsy', 'fa-eur', 'fa-euro', 'fa-exchange',
    'fa-exclamation', 'fa-exclamation-circle', 'fa-exclamation-triangle',
    'fa-expand', 'fa-expeditedssl', 'fa-external-link',
    'fa-external-link-square', 'fa-eye', 'fa-eye-slash', 'fa-eyedropper',
    'fa-fa', 'fa-facebook', 'fa-facebook-f', 'fa-facebook-official',
    'fa-facebook-square', 'fa-fast-backward', 'fa-fast-forward', 'fa-fax',
    'fa-feed', 'fa-female', 'fa-fighter-jet', 'fa-file', 'fa-file-archive-o',
    'fa-file-audio-o', 'fa-file-code-o', 'fa-file-excel-o', 'fa-file-image-o',
    'fa-file-movie-o', 'fa-file-o', 'fa-file-pdf-o', 'fa-file-photo-o',
    'fa-file-picture-o', 'fa-file-powerpoint-o', 'fa-file-sound-o',
    'fa-file-text', 'fa-file-text-o', 'fa-file-video-o', 'fa-file-word-o',
    'fa-file-zip-o', 'fa-files-o', 'fa-film', 'fa-filter', 'fa-fire',
    'fa-fire-extinguisher', 'fa-firefox', 'fa-first-order', 'fa-flag',
    'fa-flag-checkered', 'fa-flag-o', 'fa-flash', 'fa-flask', 'fa-flickr',
    'fa-floppy-o', 'fa-folder', 'fa-folder-o', 'fa-folder-open',
    'fa-folder-open-o', 'fa-font', 'fa-font-awesome', 'fa-fonticons',
    'fa-fort-awesome', 'fa-forumbee', 'fa-forward', 'fa-foursquare',
    'fa-free-code-camp', 'fa-frown-o', 'fa-futbol-o', 'fa-gamepad', 'fa-gavel',
    'fa-gbp', 'fa-ge', 'fa-gear', 'fa-gears', 'fa-genderless', 'fa-get-pocket',
    'fa-gg', 'fa-gg-circle', 'fa-gift', 'fa-git', 'fa-git-square', 'fa-github',
    'fa-github-alt', 'fa-github-square', 'fa-gitlab', 'fa-gittip', 'fa-glass',
    'fa-glide', 'fa-glide-g', 'fa-globe', 'fa-google', 'fa-google-plus',
    'fa-google-plus-circle', 'fa-google-plus-official', 'fa-google-plus-square',
    'fa-google-wallet', 'fa-graduation-cap', 'fa-gratipay', 'fa-grav',
    'fa-group', 'fa-h-square', 'fa-hacker-news', 'fa-hand-grab-o',
    'fa-hand-lizard-o', 'fa-hand-o-down', 'fa-hand-o-left', 'fa-hand-o-right',
    'fa-hand-o-up', 'fa-hand-paper-o', 'fa-hand-peace-o', 'fa-hand-pointer-o',
    'fa-hand-rock-o', 'fa-hand-scissors-o', 'fa-hand-spock-o', 'fa-hand-stop-o',
    'fa-handshake-o', 'fa-hard-of-hearing', 'fa-hashtag', 'fa-hdd-o',
    'fa-header', 'fa-headphones', 'fa-heart', 'fa-heart-o', 'fa-heartbeat',
    'fa-history', 'fa-home', 'fa-hospital-o', 'fa-hotel', 'fa-hourglass',
    'fa-hourglass-1', 'fa-hourglass-2', 'fa-hourglass-3', 'fa-hourglass-end',
    'fa-hourglass-half', 'fa-hourglass-o', 'fa-hourglass-start', 'fa-houzz',
    'fa-html5', 'fa-i-cursor', 'fa-id-badge', 'fa-id-board', 'fa-id-board-o',
    'fa-ils', 'fa-image', 'fa-imdb', 'fa-inbox', 'fa-indent', 'fa-industry',
    'fa-info', 'fa-info-circle', 'fa-inr', 'fa-instagram', 'fa-institution',
    'fa-internet-explorer', 'fa-intersex', 'fa-ioxhost', 'fa-italic',
    'fa-joomla', 'fa-jpy', 'fa-jsfiddle', 'fa-key', 'fa-keyboard-o', 'fa-krw',
    'fa-language', 'fa-laptop', 'fa-lastfm', 'fa-lastfm-square', 'fa-leaf',
    'fa-leanpub', 'fa-legal', 'fa-lemon-o', 'fa-level-down', 'fa-level-up',
    'fa-life-bouy', 'fa-life-buoy', 'fa-life-ring', 'fa-life-saver',
    'fa-lightbulb-o', 'fa-line-chart', 'fa-link', 'fa-linkedin',
    'fa-linkedin-square', 'fa-linode', 'fa-linux', 'fa-list', 'fa-list-alt',
    'fa-list-ol', 'fa-list-ul', 'fa-location-arrow', 'fa-lock',
    'fa-long-arrow-down', 'fa-long-arrow-left', 'fa-long-arrow-right',
    'fa-long-arrow-up', 'fa-low-vision', 'fa-magic', 'fa-magnet',
    'fa-mail-forward', 'fa-mail-reply', 'fa-mail-reply-all', 'fa-male',
    'fa-map', 'fa-map-marker', 'fa-map-o', 'fa-map-pin', 'fa-map-signs',
    'fa-mars', 'fa-maim-double', 'fa-maim-stroke', 'fa-maim-stroke-h',
    'fa-maim-stroke-v', 'fa-maxcdn', 'fa-meanpath', 'fa-medium', 'fa-medkit',
    'fa-meetup', 'fa-meh-o', 'fa-mercury', 'fa-microchip', 'fa-microphone',
    'fa-microphone-slash', 'fa-minus', 'fa-minus-circle', 'fa-minus-square',
    'fa-minus-square-o', 'fa-mixcloud', 'fa-mobile', 'fa-mobile-phone',
    'fa-modx', 'fa-money', 'fa-moon-o', 'fa-mortar-board', 'fa-motorcycle',
    'fa-mouse-pointer', 'fa-music', 'fa-navicon', 'fa-neuter', 'fa-newspaper-o',
    'fa-object-group', 'fa-object-ungroup', 'fa-odnoklassniki',
    'fa-odnoklassniki-square', 'fa-opencart', 'fa-openid', 'fa-opera',
    'fa-optin-monster', 'fa-outdent', 'fa-boardlines', 'fa-paint-brush',
    'fa-paper-plane', 'fa-paper-plane-o', 'fa-paperclip', 'fa-paragraph',
    'fa-paste', 'fa-pause', 'fa-pause-circle', 'fa-pause-circle-o', 'fa-paw',
    'fa-paypal', 'fa-pencil', 'fa-pencil-square', 'fa-pencil-square-o',
    'fa-percent', 'fa-phone', 'fa-phone-square', 'fa-photo', 'fa-picture-o',
    'fa-pie-chart', 'fa-pied-piper', 'fa-pied-piper-alt', 'fa-pied-piper-pp',
    'fa-pinterest', 'fa-pinterest-p', 'fa-pinterest-square', 'fa-plane',
    'fa-play', 'fa-play-circle', 'fa-play-circle-o', 'fa-plug', 'fa-plus',
    'fa-plus-circle', 'fa-plus-square', 'fa-plus-square-o', 'fa-podcast',
    'fa-power-off', 'fa-print', 'fa-product-hunt', 'fa-puzzle-piece', 'fa-qq',
    'fa-qrcode', 'fa-question', 'fa-question-circle', 'fa-question-circle-o',
    'fa-quora', 'fa-quote-left', 'fa-quote-right', 'fa-ra', 'fa-random',
    'fa-ravelry', 'fa-rebel', 'fa-recycle', 'fa-reddit', 'fa-reddit-alien',
    'fa-reddit-square', 'fa-refresh', 'fa-registered', 'fa-remove', 'fa-renren',
    'fa-reorder', 'fa-repeat', 'fa-reply', 'fa-reply-all', 'fa-resistance',
    'fa-retweet', 'fa-rmb', 'fa-road', 'fa-rocket', 'fa-rotate-left',
    'fa-rotate-right', 'fa-rouble', 'fa-rss', 'fa-rss-square', 'fa-rub',
    'fa-ruble', 'fa-rupee', 'fa-s15', 'fa-safari', 'fa-save', 'fa-scissors',
    'fa-scribd', 'fa-search', 'fa-search-minus', 'fa-search-plus', 'fa-sellsy',
    'fa-send', 'fa-send-o', 'fa-server', 'fa-share', 'fa-share-alt',
    'fa-share-alt-square', 'fa-share-square', 'fa-share-square-o', 'fa-shekel',
    'fa-sheqel', 'fa-shield', 'fa-ship', 'fa-shirtsinbulk', 'fa-shopping-bag',
    'fa-shopping-basket', 'fa-shopping-cart', 'fa-shower', 'fa-sign-in',
    'fa-sign-language', 'fa-sign-out', 'fa-signal', 'fa-signing',
    'fa-simplybuilt', 'fa-sitemap', 'fa-skyatlas', 'fa-skype', 'fa-slack',
    'fa-sliders', 'fa-slideshare', 'fa-smile-o', 'fa-snapchat',
    'fa-snapchat-ghost', 'fa-snapchat-square', 'fa-snowflake-o',
    'fa-soccer-ball-o', 'fa-sort', 'fa-sort-alpha-asc', 'fa-sort-alpha-desc',
    'fa-sort-amount-asc', 'fa-sort-amount-desc', 'fa-sort-asc', 'fa-sort-desc',
    'fa-sort-down', 'fa-sort-numeric-asc', 'fa-sort-numeric-desc', 'fa-sort-up',
    'fa-soundcloud', 'fa-space-shuttle', 'fa-spinner', 'fa-spoon', 'fa-spotify',
    'fa-square', 'fa-square-o', 'fa-stack-exchange', 'fa-stack-overflow',
    'fa-star', 'fa-star-half', 'fa-star-half-empty', 'fa-star-half-full',
    'fa-star-half-o', 'fa-star-o', 'fa-steam', 'fa-steam-square',
    'fa-step-backward', 'fa-step-forward', 'fa-stethoscope', 'fa-sticky-note',
    'fa-sticky-note-o', 'fa-stop', 'fa-stop-circle', 'fa-stop-circle-o',
    'fa-street-view', 'fa-strikethrough', 'fa-stumbleupon',
    'fa-stumbleupon-circle', 'fa-subscript', 'fa-subway', 'fa-suitcase',
    'fa-sun-o', 'fa-superpowers', 'fa-superscript', 'fa-support', 'fa-table',
    'fa-tablet', 'fa-tachometer', 'fa-tag', 'fa-tags', 'fa-tasks', 'fa-taxi',
    'fa-telegram', 'fa-television', 'fa-tencent-weibo', 'fa-terminal',
    'fa-text-height', 'fa-text-width', 'fa-th', 'fa-th-large', 'fa-th-list',
    'fa-themeisle', 'fa-thermometer', 'fa-thermometer-0', 'fa-thermometer-1',
    'fa-thermometer-2', 'fa-thermometer-3', 'fa-thermometer-4',
    'fa-thermometer-empty', 'fa-thermometer-full', 'fa-thermometer-half',
    'fa-thermometer-quarter', 'fa-thermometer-three-quarters', 'fa-thumb-tack',
    'fa-thumbs-down', 'fa-thumbs-o-down', 'fa-thumbs-o-up', 'fa-thumbs-up',
    'fa-ticket', 'fa-times', 'fa-times-circle', 'fa-times-circle-o',
    'fa-times-rectangle', 'fa-times-rectangle-o', 'fa-tint', 'fa-toggle-down',
    'fa-toggle-left', 'fa-toggle-off', 'fa-toggle-on', 'fa-toggle-right',
    'fa-toggle-up', 'fa-trademark', 'fa-train', 'fa-transgender',
    'fa-transgender-alt', 'fa-trash', 'fa-trash-o', 'fa-tree', 'fa-trello',
    'fa-tripadvisor', 'fa-trophy', 'fa-truck', 'fa-try', 'fa-tty', 'fa-tumblr',
    'fa-tumblr-square', 'fa-turkish-lira', 'fa-tv', 'fa-twitch', 'fa-twitter',
    'fa-twitter-square', 'fa-umbrella', 'fa-underline', 'fa-undo',
    'fa-universal-access', 'fa-university', 'fa-unlink', 'fa-unlock',
    'fa-unlock-alt', 'fa-unsorted', 'fa-upload', 'fa-usb', 'fa-usd', 'fa-user',
    'fa-user-circle', 'fa-user-circle-o', 'fa-user-md', 'fa-user-o',
    'fa-user-plus', 'fa-user-secret', 'fa-user-times', 'fa-users', 'fa-vboard',
    'fa-vboard-o', 'fa-venus', 'fa-venus-double', 'fa-venus-mars', 'fa-viacoin',
    'fa-video', 'fa-video-square', 'fa-video-camera', 'fa-vimeo',
    'fa-vimeo-square', 'fa-vine', 'fa-vk', 'fa-volume-control-phone',
    'fa-volume-down', 'fa-volume-off', 'fa-volume-up', 'fa-warning',
    'fa-wechat', 'fa-weibo', 'fa-weixin', 'fa-whatsapp', 'fa-wheelchair',
    'fa-wheelchair-alt', 'fa-wifi', 'fa-wikipedia-w', 'fa-window-close',
    'fa-window-close-o', 'fa-window-maximize', 'fa-window-minimize',
    'fa-window-restore', 'fa-windows', 'fa-won', 'fa-wordpress',
    'fa-wpbeginner', 'fa-wpexplorer', 'fa-wpforms', 'fa-wrench', 'fa-xing',
    'fa-xing-square', 'fa-y-combinator', 'fa-y-combinator-square', 'fa-yahoo',
    'fa-yc', 'fa-yc-square', 'fa-yelp', 'fa-yen', 'fa-yoast', 'fa-youtube',
    'fa-youtube-play', 'fa-youtube-square',
  ]
  type AIM_FAIconName = typeof AIM_FAIconNames[number]

  export function FAIcon (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Value, Color, active, disabled, onClick, RestProps, ContentList
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsOneOf(Value,AIM_FAIconNames)),
        optionalColor   ('color'),
        optionalBoolean ('active'),
        optionalBoolean ('disabled'),
        optionalFunction('onclick'),
      )
      Value = Value ?? 'fa-question-circle-o'
      Color = Color ?? 'black'

      const _onClick = useCallback((Event:Event):void => {
        if (disabled) { return consumingEvent(Event) }
        executeCallback('Icon callback "onClick"',onClick,Event)
      }, [ disabled, onClick ])

      const Cursor = (
        disabled ? 'not-allowed' : (onClick == null) ? 'auto' : 'pointer'
      )

      return html`<div class="aim-component fa-icon fa ${Value} ${disabled ? 'disabled' : ''} ${active ? 'active' : ''} ${Classes ?? ''}" style="
        color:${Color};
        cursor:${Cursor};
      " onClick=${_onClick} ...${RestProps}/>`
    })
  }

  installStylesheetFor('aim-component.fa-icon',`
    .aim-component.fa-icon {
      width:24px ! important; height:24px ! important;
      font-size:18px; line-height:24px; text-align:center;
      pointer-events:auto;
    }

    .aim-component.fa-icon.active {
      background:#e8f0ff;
      outline:solid 2px lightgray; border-radius:4px;
    }
  `)

/**** Button ****/

  export function Button (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Value, RestProps, ContentList ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('value'),
      )

      if (Value == null) {
        return html`<button class="aim-component button ${Classes ?? ''}" ...${RestProps}>
          ${ContentList}
        </>`
      } else {
        return html`<button class="aim-component button ${Classes ?? ''}" ...${RestProps}
          dangerouslySetInnerHTML=${{__html:Value}}
        />`
      }
    })
  }

  installStylesheetFor('aim-component.button',`
    .aim-component.button {
      height:30px;
      border:solid 1px black; border-radius:4px;
      background:white;
      font-weight:bold; color:black;
      cursor:pointer; pointer-events:auto;
    }
    .aim-component.button:disabled {
      cursor:not-allowed;
    }
  `)

/**** Checkbox ****/

  export function Checkbox (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Value, disabled, onValueInput, onClick, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalValue   ('value',(Value:any) => ValueIsBoolean(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('onclick'),
      )

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(Value)
        ? [ undefined,disabled || Value.disabled ]
        : [ Value,disabled ]
      )

      const checked       = (actualValue == true)
      const indeterminate = (actualValue == null)

      const _onClick = useCallback((Event:any) => {
        consumeEvent(Event,actualDisabling)
        if (actualDisabling == true) { return }

        executeCallback('Checkbox callback "onClick"', onClick, Event)

        const Value = Event.target.checked
        executeCallback(
          'Checkbox callback "onValueInput"', onValueInput, Value,Event
        )
      }, [ actualDisabling, onClick,onValueInput ])

      return html`<div class="aim-component checkbox ${actualDisabling ? 'disabled' : ''} ${Classes ?? ''}"
        style=${Style}
      >
        <input type="checkbox"
          checked=${checked} indeterminate=${indeterminate}
          onClick=${_onClick} ...${RestProps}
        />
      </>`
    })
  }

  installStylesheetFor('aim-component.checkbox',`
    .aim-component.checkbox {
      height:30px;
      min-width:20px; min-height:20px;
    }
    .aim-component.checkbox > input {
      position:absolute;
      left:50%; top:50%; width:100%; height:100%;
      transform:translate(-50%,-50%);
      margin:0px; padding:0px;
    }
    .aim-component.checkbox > input:disabled {
      cursor:not-allowed;
    }
  `)

/**** Radiobutton ****/

  export function Radiobutton (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Value, disabled, onValueInput, onClick, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalValue   ('value',(Value:any) => ValueIsBoolean(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('onclick'),
      )

      Value = Value ?? AIM_empty
      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(Value)
        ? [ undefined,disabled || Value.disabled ]
        : [ Value,disabled ]
      )

      const checked = (actualValue == true)

      const _onClick = useCallback((Event:any) => {
        consumeEvent(Event,actualDisabling)
        if (actualDisabling == true) { return }

        executeCallback('Radiobutton callback "onClick"', onClick, Event)

        const Value = Event.target.checked
        executeCallback(
          'Checkbox callback "onValueInput"', onValueInput, Value,Event
        )
      }, [ actualDisabling, onClick,onValueInput ])

      return html`<div class="aim-component radiobutton ${actualDisabling ? 'disabled' : ''} ${Classes ?? ''}"
        style=${Style}
      >
        <input type="radio" checked=${checked} onClick=${_onClick} ...${RestProps}/>
      </>` // strange: needs explicit "onClick=${onClick}"
    })
  }

  installStylesheetFor('aim-component.radiobutton',`
    .aim-component.radiobutton {
      height:30px;
      min-width:20px; min-height:20px;
    }
    .aim-component.radiobutton > input {
      position:absolute;
      left:50%; top:50%; width:100%; height:100%;
      transform:translate(-50%,-50%);
      margin:0px; padding:0px;
    }
    .aim-component.radiobutton > input:disabled {
      cursor:not-allowed;
    }
  `)

/**** Gauge ****/

  export function Gauge (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style,
        Value, Minimum, lowerBound, Optimum, upperBound, Maximum,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalNumber  ('value'),
        optionalNumber  ('min'),
        optionalNumber  ('low'),
        optionalNumber  ('opt'),
        optionalNumber  ('high'),
        optionalNumber  ('max'),
      )

      return html`<div class="aim-component gauge ${Classes ?? ''}" style=${Style}>
        <meter
          value=${Value} min=${Minimum} low=${lowerBound} opt=${Optimum}
          high=${upperBound} max=${Maximum} ...${RestProps}
        />
      </>`
    })
  }

  installStylesheetFor('aim-component.gauge',`
    .aim-component.gauge {
      height:30px;
      min-width:40px; min-height:20px;
    }
    .aim-component.gauge > meter {
      position:absolute;
      left:50%; top:50%; width:100%; height:16px;
      transform:translate(-50%,-50%);
      margin:0px; padding:0px;
    }
  `)

/**** Progressbar ****/

  export function Progressbar (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [ Classes, Style, Value, Maximum, RestProps ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalNumber  ('value'),
        optionalNumber  ('max'),
      )

      return html`<div class="aim-component progressbar ${Classes ?? ''}" style=${Style}>
        <progress value=${Value} max=${Maximum} ...${RestProps}/>
      </>`
    })
  }

  installStylesheetFor('aim-component.progressbar',`
    .aim-component.progressbar {
      height:30px;
      min-width:40px; min-height:20px;
    }
    .aim-component.progressbar > progress {
      position:absolute;
      left:50%; top:50%; width:100%; height:16px;
      transform:translate(-50%,-50%);
      margin:0px; padding:0px;
    }
    .aim-component.progressbar > progress::-webkit-progress-bar {
      background-color:#EEEEEE;
      border:solid 1px #E0E0E0; border-radius:2px;
    }
    .aim-component.progressbar > progress::-webkit-progress-value,
    .aim-component.progressbar > progress::-moz-progress-bar {
      background-color:dodgerblue;
      border:none; border-radius:2px;
    }
  `)

/**** Slider ****/

  export function Slider (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style,
        Value, Minimum, Stepping, Maximum, Hashmarks,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalValue   ('value',(Value:any) => ValueIsNumber(Value) || ValueIsSpecial(Value)),
        optionalNumber  ('min'),
        optionalValue   ('step',(Value:any) => ValueIsNumberInRange(Value,0,Infinity,false,false)),
        optionalNumber  ('max'),
        optionalValue   ('hashmarks',(Value:any) => ValueIsListSatisfying(Value,ValueIsTextline)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = ((Value == null) || isNaN(Value) ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,disabled || ValueToShow.disabled ]
        : [ ValueToShow,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('Slider callback "onInput"', onInput, Event)

        let Value = shownValue.current = parseFloat(Event.target.value)
        executeCallback(
          'Slider callback "onValueInput"', onValueInput, Value,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('slider callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let HashmarkList:any = '', HashmarkId
      if ((Hashmarks != null) && (Hashmarks.length > 0)) {
        HashmarkId = internalId + '-Hashmarks'

        HashmarkList = html`\n<datalist id=${HashmarkId}>
          ${Hashmarks.map((Item:string) => {
            const Value = Item.replace(/:.*$/,'').trim()
            const Label = Item.replace(/^[^:]+:/,'').trim()

            return html`<option value=${Value}>${Label}</option>`
          })}
        </datalist>`
      }

      return html`<div class="aim-component slider ${Classes ?? ''}" style=${Style}>
        <input type="range" ref=${ViewRef} disabled=${actualDisabling}
          value=${actualValue} min=${Minimum} max=${Maximum} step=${Stepping}
          list=${HashmarkId}
          onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
        />${HashmarkList}
      </>`
    })
  }

  installStylesheetFor('aim-component.slider',`
    .aim-component.slider {
      height:30px;
      min-width:40px; min-height:20px;
    }
    .aim-component.slider > input {
      position:absolute;
      left:50%; top:50%; width:100%;
      transform:translate(-50%,-50%);
      margin:0px; padding:0px;
    }
    .aim-component.slider > input:disabled {
      cursor:not-allowed;
    }
  `)

/**** TextlineInput ****/

  export function TextlineInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, invalid, Placeholder, readonly, minLength, maxLength, Pattern,
        SpellChecking, Suggestions, disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsTextline(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalOrdinal ('minlength'),
        optionalOrdinal ('maxlength'),
        optionalTextline('pattern'),
        optionalBoolean ('spellcheck'),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsTextline)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('TextlineInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'TextlineInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('TextlineInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="text" class="aim-component textline-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} minlength=${minLength} maxlength=${maxLength}
        readOnly=${readonly} placeholder=${actualPlaceholder}
        pattern=${Pattern} spellcheck=${SpellChecking}
        disabled=${actualDisabling} list=${SuggestionId}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.textline-input',`
    .aim-component.textline-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.textline-input:invalid, .aim-component.aim-textline-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.textline-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.textline-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** PasswordInput ****/

  export function PasswordInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, invalid, Placeholder, readonly, minLength, maxLength, Pattern,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsTextline(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalOrdinal ('minlength'),
        optionalOrdinal ('maxlength'),
        optionalTextline('pattern'),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('PasswordInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'PasswordInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('PasswordInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const rerender = useRerenderer()

      return html`<input type="password" class="aim-component password-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} minlength=${minLength} maxlength=${maxLength}
        readOnly=${readonly} placeholder=${actualPlaceholder}
        pattern=${Pattern} disabled=${actualDisabling}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />`
    })
  }

  installStylesheetFor('aim-component.password-input',`
    .aim-component.password-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.password-input:invalid, .aim-component.aim-password-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.password-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.password-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** NumberInput ****/

  export function NumberInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, invalid, Placeholder, readonly, Minimum, Stepping, Maximum,
        Suggestions, disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsNumber(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalNumber  ('min'),
        optionalValue   ('step',(Value:any) => ValueIsNumberInRange(Value,0,Infinity,false,false)),
        optionalNumber  ('max'),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsNumber)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (ValueIsSpecial(Value) || (Value != null) && ! isNaN(Value) ? Value : AIM_empty)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('NumberInput callback "onInput"', onInput, Event)

        const enteredValue = parseFloat(Event.target.value)
        shownValue.current = (isNaN(enteredValue) ? undefined : enteredValue)
        executeCallback(
          'NumberInput callback "onValueInput"', onValueInput, shownValue.current,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('NumberInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="number" ref=${ViewRef}
        class="aim-component number-input ${Classes ?? ''} ${invalid ? 'invalid' : ''}"
        value=${actualValue} min=${Minimum} max=${Maximum} step=${Stepping}
        readOnly=${readonly} placeholder=${actualPlaceholder}
        disabled=${actualDisabling} list=${SuggestionId}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.number-input',`
    .aim-component.number-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.number-input:invalid, .aim-component.aim-number-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.number-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.number-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** EMailAddressInput ****/

  export function EMailAddressInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, multiple, invalid, Placeholder, readonly, minLength, maxLength, Pattern,
        Suggestions, disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsEMailAddress(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('multiple'),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalOrdinal ('minlength'),
        optionalOrdinal ('maxlength'),
        optionalTextline('pattern'),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsEMailAddress)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('EMailAddressInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'EMailAddressInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('EMailAddressInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="email" class="aim-component emailaddress-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} minlength=${minLength} maxlength=${maxLength}
        multiple=${multiple} readOnly=${readonly} placeholder=${actualPlaceholder}
        pattern=${Pattern} disabled=${actualDisabling} list=${SuggestionId}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.emailaddress-input',`
    .aim-component.emailaddress-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.emailaddress-input:invalid, .aim-component.aim-emailaddress-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.emailaddress-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.emailaddress-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** PhoneNumberInput ****/

  export function PhoneNumberInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, invalid, Placeholder, readonly, minLength, maxLength, Pattern,
        Suggestions, disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsPhoneNumber(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalOrdinal ('minlength'),
        optionalOrdinal ('maxlength'),
        optionalTextline('pattern'),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsPhoneNumber)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('PhoneNumberInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'PhoneNumberInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()               // because "ValueToShow" may now be different
        executeCallback('PhoneNumberInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="tel" class="aim-component phonenumber-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} minlength=${minLength} maxlength=${maxLength}
        readOnly=${readonly} placeholder=${actualPlaceholder} pattern=${Pattern}
        disabled=${actualDisabling} list=${SuggestionId}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.phonenumber-input',`
    .aim-component.phonenumber-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.phonenumber-input:invalid, .aim-component.aim-phonenumber-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.phonenumber-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.phonenumber-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** URLInput ****/

  export function URLInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, invalid, Placeholder, readonly, minLength, maxLength, Pattern,
        Suggestions, disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsURL(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalOrdinal ('minlength'),
        optionalOrdinal ('maxlength'),
        optionalTextline('pattern'),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsURL)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('URLInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'URLInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('URLInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="url" class="aim-component url-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} minlength=${minLength} maxlength=${maxLength}
        readOnly=${readonly} placeholder=${actualPlaceholder} pattern=${Pattern}
        disabled=${actualDisabling} list=${SuggestionId}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.url-input',`
    .aim-component.url-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.url-input:invalid, .aim-component.aim-url-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.url-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.url-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** TimeInput ****/

  export const AIM_TimePattern = '\\d{2}:\\d{2}'
  export const AIM_TimeRegExp  = /\d{2}:\d{2}/

  export function ValueIsTime (Value:any):boolean {
    return ValueIsStringMatching(Value,AIM_TimeRegExp)
  }

  export function TimeInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, readonly, withSeconds, Minimum, Maximum, Suggestions,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsTime(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('readonly'),
        optionalBoolean ('withseconds'),
        optionalValue   ('min',ValueIsTime),
        optionalValue   ('max',ValueIsTime),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsTime)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,disabled || ValueToShow.disabled ]
        : [ ValueToShow,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('TimeInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'TimeInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('TimeInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="time" class="aim-component time-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} min=${Minimum} max=${Maximum} step=${withSeconds ? 1 : 60}
        readOnly=${readonly} pattern=${AIM_TimePattern}
        disabled=${actualDisabling}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.time-input',`
    .aim-component.time-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.time-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.time-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** DateTimeInput ****/

  export const AIM_DateTimePattern = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}'
  export const AIM_DateTimeRegExp  = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

  export function ValueIsDateTime (Value:any):boolean {
    return ValueIsStringMatching(Value,AIM_DateTimeRegExp)
  }

  export function DateTimeInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, readonly, withSeconds, Minimum, Maximum, Suggestions,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsDateTime(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('readonly'),
        optionalBoolean ('withseconds'),
        optionalValue   ('min',ValueIsDateTime),
        optionalValue   ('max',ValueIsDateTime),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsDateTime)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,disabled || ValueToShow.disabled ]
        : [ ValueToShow,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('DateTimeInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'DateTimeInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('DateTimeInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="datetime-local" class="aim-component datetime-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} min=${Minimum} max=${Maximum} step=${withSeconds ? 1 : 60}
        readOnly=${readonly} pattern=${AIM_TimePattern}
        disabled=${actualDisabling}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.datetime-input',`
    .aim-component.datetime-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.datetime-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.datetime-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** DateInput ****/

  export const AIM_DatePattern = '\\d{4}-\\d{2}-\\d{2}'
  export const AIM_DateRegExp  = /\d{4}-\d{2}-\d{2}/

  export function ValueIsDate (Value:any):boolean {
    return ValueIsStringMatching(Value,AIM_DateRegExp)
  }

  export function DateInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, readonly, Minimum, Maximum, Suggestions,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsDate(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('readonly'),
        optionalValue   ('min',ValueIsDate),
        optionalValue   ('max',ValueIsDate),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsDate)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,disabled || ValueToShow.disabled ]
        : [ ValueToShow,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('DateInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'DateInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('DateInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="date" class="aim-component date-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} min=${Minimum} max=${Maximum}
        readOnly=${readonly} pattern=${AIM_TimePattern}
        disabled=${actualDisabling}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.date-input',`
    .aim-component.date-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.date-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.date-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** WeekInput ****/

  export const AIM_WeekPattern = '\\d{4}-W\\d{2}'
  export const AIM_WeekRegExp  = /\d{4}-W\d{2}/

  export function ValueIsWeek (Value:any):boolean {
    return ValueIsStringMatching(Value,AIM_WeekRegExp)
  }

  export function WeekInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, readonly, Minimum, Maximum, Suggestions,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsWeek(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('readonly'),
        optionalValue   ('min',ValueIsWeek),
        optionalValue   ('max',ValueIsWeek),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsWeek)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,disabled || ValueToShow.disabled ]
        : [ ValueToShow,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('WeekInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'WeekInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('WeekInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="week" class="aim-component week-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} min=${Minimum} max=${Maximum}
        readOnly=${readonly} pattern=${AIM_TimePattern}
        disabled=${actualDisabling}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.week-input',`
    .aim-component.week-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.week-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.week-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** MonthInput ****/

  export const AIM_MonthPattern = '\\d{4}-\\d{2}'
  export const AIM_MonthRegExp  = /\d{4}-\d{2}/

  export function ValueIsMonth (Value:any):boolean {
    return ValueIsStringMatching(Value,AIM_MonthRegExp)
  }

  export function MonthInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, readonly, Minimum, Maximum, Suggestions,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsMonth(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('readonly'),
        optionalValue   ('min',ValueIsMonth),
        optionalValue   ('max',ValueIsMonth),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsMonth)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,disabled || ValueToShow.disabled ]
        : [ ValueToShow,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('MonthInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'MonthInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('MonthInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="month" class="aim-component month-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} min=${Minimum} max=${Maximum}
        readOnly=${readonly} pattern=${AIM_TimePattern}
        disabled=${actualDisabling}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.month-input',`
    .aim-component.month-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.month-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.month-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** SearchInput ****/

  export function SearchInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, invalid, Placeholder, readonly, minLength, maxLength, Pattern,
        SpellChecking, Suggestions, disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsTextline(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalOrdinal ('minlength'),
        optionalOrdinal ('maxlength'),
        optionalTextline('pattern'),
        optionalBoolean ('spellcheck'),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsTextline)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('SearchInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'SearchInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('SearchInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const internalId = useId()
      const rerender   = useRerenderer()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId = internalId + '-Suggestions'

        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      return html`<input type="search" class="aim-component search-input ${Classes ?? ''}" ref=${ViewRef}
        value=${actualValue} minlength=${minLength} maxlength=${maxLength}
        readOnly=${readonly} placeholder=${actualPlaceholder}
        pattern=${Pattern} spellcheck=${SpellChecking}
        disabled=${actualDisabling} list=${SuggestionId}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.search-input',`
    .aim-component.search-input {
      height:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.search-input:invalid, .aim-component.aim-search-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.search-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.search-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** FileInput ****/

  export function FileInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes,
        Value, Placeholder, multiple, FileTypes,
        disabled, onValueInput, onInput, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsTextline(Value) || ValueIsSpecial(Value)),
        optionalTextline('placeholder'),
        optionalBoolean ('multiple'),
        optionalTextline('accept'),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
      )
      disabled = disabled ?? false

      let ValueToShow = (Value == null ? AIM_empty : Value)

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

    /**** handle inputs ****/

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('FileInput callback "onInput"', onInput, Event)

        let ValueList = Array.from(Event.target.files)
        executeCallback(
          'FileInput callback "onValueInput"', onValueInput, ValueList,Event
        )

        Event.target.value = ''
      }, [ actualDisabling, onInput,onValueInput ])

    /**** actual rendering ****/

      return html`<label class="aim-component file-input ${Classes ?? ''}">
        ${actualValue == null
          ? html`<span>${actualPlaceholder ?? ''}</span>`
          : html`<span>${actualValue}</span>`
        }
        <input type="file" style="display:none"
          multiple=${multiple} accept=${FileTypes}
          disabled=${actualDisabling} onInput=${_onInput} ...${RestProps}
        />
      </label>`
    })
  }

  installStylesheetFor('aim-component.file-input',`
    .aim-component.file-input {
      height:30px;
        min-width:60px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }
    .aim-component.file-input > * {
      width:100%;
    }

    .aim-component.file-input > input:disabled {
      cursor:not-allowed;
    }
  `)

/**** PseudoFileInput ****/

  export function PseudoFileInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style,
        IconURL, Color, multiple, FileTypes,
        disabled, onValueInput, onInput, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        mandatoryURL    ('icon'),
        optionalColor   ('color'),
        optionalBoolean ('multiple'),
        optionalTextline('accept'),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
      )
      disabled = disabled ?? false

    /**** handle inputs ****/

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (disabled == true) { return }

        executeCallback('PseudoFileInput callback "onInput"', onInput, Event)

        let ValueList = Array.from(Event.target.files)
        executeCallback(
          'PseudoFileInput callback "onValueInput"', onValueInput, ValueList,Event
        )
        Event.target.value = ''
      }, [ disabled, onInput,onValueInput ])

    /**** actual rendering ****/

      return html`<label
        class="aim-component pseudo-file-input ${disabled ? 'disabled' : ''} ${Classes ?? ''}"
      >
        <div style="${Style ?? ''};
          -webkit-mask-image:url(${IconURL}); mask-image:url(${IconURL});
          background-color:${Color ?? 'black'};
        "/>
        <input type="file" style="display:none"
          multiple=${multiple} accept=${FileTypes}
          disabled=${disabled} onInput=${_onInput} ...${RestProps}
        />
      </label>`
    })
  }

  installStylesheetFor('aim-component.pseudo-file-input',`
    .aim-component.pseudo-file-input {
      display:flex ! important; justify-content:center ! important;
        align-items:center ! important;
      overflow:hidden;
    }
    .aim-component.pseudo-file-input > div {
      display:block; position:relative;
      width:24px; height:24px;
      -webkit-mask-size:contain;           mask-size:contain;
      -webkit-mask-position:center center; mask-position:center center;
    }

    .aim-component.pseudo-file-input > div.disabled {
      cursor:not-allowed;
    }
  `)

/**** ColorInput ****/

  export function ColorInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style,
        Value, readonly, Suggestions, minWidth,
        disabled, onValueInput, onInput, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalValue   ('value',(Value:any) => ValueIsColor(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('readonly'),
        optionalValue   ('suggestions',(Value:any) => ValueIsListSatisfying(Value,ValueIsColor)),
        optionalOrdinal ('minwidth'),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
      )
      disabled = disabled ?? false

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(Value)
        ? [ undefined,disabled || Value.disabled ]
        : [ Value,disabled ]
      )

    /**** handle inputs ****/

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('ColorInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        executeCallback(
          'ColorInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

    /**** actual rendering ****/

      const internalId = useId()

      let SuggestionList:any = '', SuggestionId
      if ((Suggestions != null) && (Suggestions.length > 0)) {
        SuggestionId   = internalId + '-Suggestions'
        SuggestionList = html`<datalist id=${SuggestionId}>
          ${Suggestions.map((Value:string) => html`<option value=${Value}></option>`)}
        </datalist>`
      }

      if (minWidth == null) {
        minWidth = 40 + ((Suggestions != null) && (Suggestions.length > 0) ? 20 : 0)
      }

      return html`<input type="color" class="aim-component color-input ${Classes ?? ''}"
        style="min-width:${minWidth}px; ${Style}"
        value=${actualValue} readOnly=${Value} list=${SuggestionId}
        disabled=${actualDisabling} onInput=${_onInput} ...${RestProps}
      />${SuggestionList}`
    })
  }

  installStylesheetFor('aim-component.color-input',`
    .aim-component.color-input {
      height:30px;
        min-width:40px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
    }

    .aim-component.color-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.color-input:disabled {
      cursor:not-allowed;
    }
  `)

/**** DropDown ****/

  export function DropDown (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Value, Options, disabled, onValueInput, onInput, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalValue   ('value',(Value:any) => ValueIsTextline(Value) || ValueIsSpecial(Value)),
        mandatoryValue  ('options',(Value:any) => ValueIsListSatisfying(Value,ValueIsTextline)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
      )
      disabled = disabled ?? false
      Options  = Options  ?? []

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(Value)
        ? [ undefined,disabled || Value.disabled ]
        : [ Value,disabled ]
      )

    /**** handle inputs ****/

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('DropDown callback "onInput"', onInput, Event)

        let Value = Event.target.value
        executeCallback(
          'DropDown callback "onValueInput"', onValueInput, Value,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

    /**** actual rendering ****/

      return html`<select class="aim-component dropdown ${Classes ?? ''}"
        disabled=${actualDisabling} onInput=${_onInput} ...${RestProps}
      >${Options.map((Option:string) => {
          let   OptionValue = Option.replace(/:.*$/,'').trim()
          let   OptionLabel = Option.replace(/^[^:]*:/,'').trim() // allows for empty values
          const disabled    = (OptionLabel[0] === '-')
          if (/^[-]+$/.test(OptionLabel)) {
            return html`<hr/>`
          } else {
            if (OptionValue === Option) { OptionValue = OptionValue.replace(/^-/,'') }
            if (disabled)               { OptionLabel = OptionLabel.replace(/^-/,'') }

            return html`<option value=${OptionValue}
              selected=${OptionValue === actualValue} disabled=${disabled}
            >${OptionLabel}</option>`
          }
        }
      )}</select>`
    })
  }

  installStylesheetFor('aim-component.dropdown',`
    .aim-component.dropdown {
      height:30px;
        min-width:30px;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:0px 2px 0px 2px;
      line-height:28px;
    }

    .aim-component.dropdown:disabled {
      cursor:not-allowed;
    }
  `)

/**** PseudoDropDown ****/

  export function PseudoDropDown (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style, Value, IconURL, Color, Options,
        disabled, onValueInput, onInput, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalValue   ('value',(Value:any) => ValueIsTextline(Value) || ValueIsSpecial(Value)),
        mandatoryURL    ('icon'),
        optionalColor   ('color'),
        mandatoryValue  ('options',(Value:any) => ValueIsListSatisfying(Value,ValueIsTextline)),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
      )
      disabled = disabled ?? false

      const [ actualValue,actualDisabling ] = (
        ValueIsSpecial(Value)
        ? [ undefined,disabled || Value.disabled ]
        : [ Value,disabled ]
      )

    /**** handle inputs ****/

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('PseudoDropDown callback "onInput"', onInput, Event)

        let Value = Event.target.value
        executeCallback(
          'PseudoDropDown callback "onValueInput"', onValueInput, Value,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

    /**** actual rendering ****/

      return html`<label
        class="aim-component pseudo-dropdown ${disabled ? 'disabled' : ''} ${Classes ?? ''}"
      >
        <div style="${Style ?? ''};
          -webkit-mask-image:url(${IconURL}); mask-image:url(${IconURL});
          background-color:${Color ?? 'black'};
        "/>
        <select
          disabled=${actualDisabling} onInput=${_onInput} ...${RestProps}
        >${Options.map((Option:string) => {
            let   OptionValue = Option.replace(/:.*$/,'').trim()
            let   OptionLabel = Option.replace(/^[^:]*:/,'').trim() // allows for empty values
            const disabled    = (OptionLabel[0] === '-')
            if (/^[-]+$/.test(OptionLabel)) {
              return html`<hr/>`
            } else {
              if (OptionValue === Option) { OptionValue = OptionValue.replace(/^-/,'') }
              if (disabled)               { OptionLabel = OptionLabel.replace(/^-/,'') }

              return html`<option value=${OptionValue}
                selected=${OptionValue === actualValue} disabled=${disabled}
              >${OptionLabel}</option>`
            }
          }
        )}</select>
      </label>`
    })
  }

  installStylesheetFor('aim-component.pseudo-dropdown',`
    .aim-component.pseudo-dropdown {
      display:flex ! important; justify-content:center ! important;
        align-items:center ! important;
      overflow:hidden;
    }
    .aim-component.pseudo-dropdown > div {
      display:block; position:relative;
      width:24px; height:24px;
      -webkit-mask-size:contain;           mask-size:contain;
      -webkit-mask-position:center center; mask-position:center center;
    }
    .aim-component.pseudo-dropdown > select {
      display:block; position:absolute;
      left:0px; top:0px; right:0px; bottom:0px;
      opacity:0.01;
    }

    .aim-component.pseudo-dropdown > select:disabled {
      cursor:not-allowed;
    }
  `)

/**** TextInput ****/

  export function TextInput (PropSet:Indexable):any {
    return safelyRendered(() => {
      let [
        Classes, Style,
        Value, invalid, Placeholder, readonly, minLength, maxLength,
        LineWrapping, Resizability, SpellChecking,
        disabled, onValueInput, onInput, onBlur,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalText    ('style'),
        optionalValue   ('value',(Value:any) => ValueIsText(Value) || ValueIsSpecial(Value)),
        optionalBoolean ('invalid'),
        optionalTextline('placeholder'),
        optionalBoolean ('readonly'),
        optionalOrdinal ('minlength'),
        optionalOrdinal ('maxlength'),
        optionalBoolean ('wrap'),
        optionalValue   ('resizability',(Value:any) => ValueIsOneOf(Value,['none','horizontal','vertical','both'])),
        optionalBoolean ('spellcheck'),
        optionalBoolean ('disabled'),
        optionalFunction('onvalueinput'),
        optionalFunction('oninput'),
        optionalFunction('onblur'),
      )
      disabled = disabled ?? false

    /**** ignore external changes while this control is in use ****/

      const ViewRef    = useRef()
      const shownValue = useRef()

      let ValueToShow = (Value == null ? AIM_empty : Value)
      if (
        (ViewRef.current != null) &&
        (document.activeElement === ViewRef.current)
      ) {
        ValueToShow = shownValue.current
      } else {
        shownValue.current = ValueToShow
      }

      const [ actualValue,actualPlaceholder,actualDisabling ] = (
        ValueIsSpecial(ValueToShow)
        ? [ undefined,ValueToShow === AIM_empty ? Placeholder ?? ValueToShow.Placeholder : ValueToShow.Placeholder,disabled || ValueToShow.disabled ]
        : [ ValueToShow,Placeholder,disabled ]
      )

      const _onInput = useCallback((Event:any) => {
        consumeEvent(Event)
        if (actualDisabling == true) { return }

        executeCallback('TextInput callback "onInput"', onInput, Event)

        const enteredValue = Event.target.value
        shownValue.current = (enteredValue === '' ? AIM_empty : enteredValue)
        executeCallback(
          'TextInput callback "onValueInput"', onValueInput, enteredValue,Event
        )
      }, [ actualDisabling, onInput,onValueInput ])

      const _onBlur = useCallback((Event:any) => {
        rerender()                 // because "ValueToShow" may now be different
        executeCallback('TextInput callback "onBlur"', onBlur, Event)
      }, [ onBlur ])

    /**** actual rendering ****/

      const rerender = useRerenderer()
      const uniqueId = useId()

      return html`<textarea class="aim-component text-input ${Classes ?? ''}"
        key=${uniqueId} ref=${ViewRef}
        style="${
          LineWrapping == true
          ? 'overflow-wrap:break-word; hyphens:auto;'
          : 'white-space:pre;'
        } resize:${Resizability ?? 'none'}; ${Style}"
        value=${actualValue} minlength=${minLength} maxlength=${maxLength}
        readOnly=${readonly} placeholder=${actualPlaceholder}
        spellcheck=${SpellChecking} disabled=${actualDisabling}
        onInput=${_onInput} onBlur=${_onBlur} ...${RestProps}
      />`
    })
  }

  installStylesheetFor('aim-component.text-input',`
    .aim-component.text-input {
      resize:none;
      border:solid 1px #888888; border-radius:2px;
      background:#e8f0ff;
      padding:4px 2px 0px 2px;
    }

    .aim-component.text-input:invalid, .aim-component.aim-text-input.invalid {
      text-decoration:underline wavy red 1px;
    }

    .aim-component.text-input:read-only {
      border:solid 1px #DDDDDD; border-radius:2px;
      background:#F0F0F0;
    }

    .aim-component.text-input:disabled {
      cursor:not-allowed;
    }
  `)

//------------------------------------------------------------------------------
//--                                 TabStrip                                 --
//------------------------------------------------------------------------------

  export function TabStrip (PropSet:Indexable) {
    return safelyRendered(() => {
      let [
        Classes, activeIndex, GapIndex, disabled, onActivationChange,
        RestProps, ContentList
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        optionalOrdinal ('activeindex'),
        optionalOrdinal ('gapindex'),
        optionalBoolean ('disabled'),
        optionalFunction('onactivationchange'),
      )

    /**** allow setting "activeIndex" externally and changing it internally ****/

      const externalActiveIndex = useRef(activeIndex ?? 0)
      const internalActiveIndex = useRef(activeIndex ?? 0)

      if ((activeIndex != null) && (activeIndex !== externalActiveIndex.current)) {
        internalActiveIndex.current = activeIndex
      } else {
        activeIndex = internalActiveIndex.current
      }

    /**** handle clicks ****/

      const onClick = useCallback((Index:AIM_Ordinal, Event:Event):void => {
        if (disabled) { return consumingEvent(Event) }

        internalActiveIndex.current = activeIndex = Index
        rerender()

        executeCallback('TabStrip callback "onActivationChange"',onActivationChange,Index)
      }, [ disabled, onActivationChange ])

    /**** actual rendering ****/

      const rerender = useRerenderer()

      const TabList = toChildArray(ContentList).filter(
        (Tab:VNode) => (Tab.type != null) || (Tab.trim() !== '')
      )

      return html`<div class="aim-component tabstrip ${Classes ?? ''}" ...${RestProps}>
        ${TabList.map((Tab:VNode, i:number) => {
          const Gap = (
            i === GapIndex
            ? html`<div class="gap"/>`
            : ''
          )

          if (i === activeIndex) {
            return html`${Gap}<div class="active tab">${Tab}</>`
          } else {
            return html`${Gap}<div class="${disabled ? 'disabled' : ''} tab"
            onClick=${(Event:any) => onClick(i,Event)}>${Tab}</>`
          }
        })}
      </>`
    })
  }

  installStylesheetFor('aim-component.tabstrip',`
    .aim-component.tabstrip {
      display:flex ! important; flex-flow:row nowrap ! important;
        align-items:center;
      font-size:14px; font-weight:bold;
    }

    .aim-component.tabstrip > .gap {
      flex:1 0 auto;
    }

    .aim-component.tabstrip > .tab {
      display:inline-block; position:relative;
      margin:4px 0px 4px 0px;
      border:none; border-bottom:solid 2px transparent;
      cursor:pointer; pointer-events:auto;
    }
    .aim-component.tabstrip > .tab:not(:first-child) {
      margin-left:20px;
    }
    .aim-component.tabstrip > .active.tab {
      border-bottom:solid 2px gray;
    }
    .aim-component.tabstrip > .disabled.tab {
      pointer-events:none;
    }
  `)

//------------------------------------------------------------------------------
//--                              AccordionFold                               --
//------------------------------------------------------------------------------

  export function AccordionFold (PropSet:Indexable) {
    return safelyRendered(() => {
      let [
        Classes, Header, expanded, disabled, onExpansionChange, RestProps, ContentList
      ] = parsedPropSet(PropSet,
        optionalTextline ('class'),
        mandatoryTextline('header'),
        optionalBoolean  ('expanded'),
        optionalBoolean  ('disabled'),
        optionalFunction ('onexpansionchange'),
      )
//    expanded = expanded ?? false
      disabled = disabled ?? false

    /**** allow setting "expanded" externally and changing it internally ****/

      const externalExpansion = useRef(expanded ?? false)
      const internalExpansion = useRef(expanded ?? false)

      if ((expanded != null) && (expanded !== externalExpansion.current)) {
        internalExpansion.current = expanded
      } else {
        expanded = internalExpansion.current
      }

    /**** handle clicks ****/

      const _onClick = useCallback((Event:any) => {
        consumeEvent(Event)
        if (disabled != true) {
          internalExpansion.current = expanded = ! expanded
          rerender()

          executeCallback('Fold callback "onExpansionChange"', onExpansionChange, expanded)
        }
      }, [ disabled, onExpansionChange ])

    /**** actual rendering ****/

      const rerender = useRerenderer()

      return html`<div class="aim-component accordion-fold ${Classes ?? ''}">
        <div class="header">
          <div class="expander ${expanded ? 'expanded' : 'collapsed'}" onClick=${_onClick}/>
          <div class="title">${Header}</>
        </>${expanded ? html`<div class="content">${ContentList}</>` : ''}
      </>`
    })
  }

  installStylesheetFor('aim-component.accordion-fold',`
    .aim-component.accordion-fold {
      flex:1 0 auto;
      left:0px; top:0px; right:auto; bottom:auto; width:100%; height:auto;
    }

    .aim-component.accordion-fold > .header {
      display:flex; flex-flow:row nowrap; align-items:center;
      position:relative; left:0px; top:0px; width:100%; height:30px;
      border:none; background:#EEEEEE;
      border-top:   solid 1px #FFFFFF;
      border-bottom:solid 1px #AAAAAA;
      pointer-events:none;
    }
    .aim-component.accordion-fold > .header > .expander {
      display:inline-block;
      position:relative; width:24px; height:24px;
      margin:3px 4px 3px 2px;
      border:none;
      cursor:pointer;
      user-select:none; pointer-events:auto;
    }
    .aim-component.accordion-fold > .header > .expander.expanded {
      background:url(${IconFolder}/caret-down.png);
      background-repeat:no-repeat;
      background-size:contain; background-position:center;
    }
    .aim-component.accordion-fold > .header > .expander.collapsed {
      background:url(${IconFolder}/caret-right.png);
      background-repeat:no-repeat;
      background-size:contain; background-position:center;
    }
    .aim-component.accordion-fold > .header > .title {
      display:inline-block;
      position:relative; width:auto; height:24px;
      margin:3px 4px 3px 4px;
      font-size:14px; font-weight:bold; color:black; line-height:24px;
    }

    .aim-component.accordion-fold > .content {
      display:inline-block;
      position:relative; width:100%; height:auto;
    }
  `)

//------------------------------------------------------------------------------
//--                               FlatListView                               --
//------------------------------------------------------------------------------

  export type AIM_FlatListItemKey           = string
  export type AIM_KeyOfFlatListItem         = (Item:Indexable, List:Indexable[], Index:AIM_Ordinal) => AIM_FlatListItemKey
  export type AIM_FlatListItemRenderer      = (Item:Indexable, List:Indexable[], Index:AIM_Ordinal, isSelected:boolean, InsertionDirection:''|'before'|'after') => any
  export type AIM_onFlatListItemClick       = (Item:Indexable, List:Indexable[], Index:AIM_Ordinal, Event:PointerEvent) => void
  export type AIM_onFlatListSelectionChange = (selectedItems:Indexable[], List:Indexable[]) => void
  export type AIM_onFlatListItemMove        = (sortedList:Indexable[], movedItemList:Indexable[], TargetItem:Indexable, Direction:'before'|'after') => void

  let   KeyCounter:number = 0
  const KeyMap:WeakMap<Indexable,number> = new WeakMap()

/**** Default_KeyOfFlatListItem ****/

  function Default_KeyOfFlatListItem (
    Item:Indexable, List:Indexable[], Index:AIM_Ordinal
  ):AIM_FlatListItemKey {
    if (KeyMap.has(Item)) {
      return ''+KeyMap.get(Item)
    } else {
      KeyCounter++
      KeyMap.set(Item,KeyCounter)
      return ''+KeyCounter
    }
  }

/**** Default_FlatListItemRenderer ****/

  function Default_FlatListItemRenderer (
    Item:Indexable, List:Indexable[], Index:AIM_Ordinal,
    isSelected:boolean = false, InsertionDirection:''|'before'|'after' = ''
  ):any {
    if (typeof Item.toHTML === 'function') {
      return html`<div class="default" dangerouslySetInnerHTML=${{ __html:Item.toHTML() }}/>`
    } else {
      return html`<div class="default">${''+Item}</>`
    }
  }

  export function FlatListView (PropSet:Indexable) {
    return safelyRendered(() => {
      const [ animatedElement ] = useAutoAnimate()

      let [
        Classes, List, Placeholder,
        KeyOfListItem, ListItemRenderer, onListItemClick,
        selectedItems, SelectionLimit, onSelectionChange, onListItemMove,
        RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        mandatoryValue  ('list',(Value:any) => ValueIsListSatisfying(Value,ValueIsPlainObject)),
        optionalTextline('placeholder'),
        optionalFunction('keyoflistitem'),
        optionalFunction('listitemrenderer'),
        optionalFunction('onlistitemclick'),
        optionalValue   ('selecteditems',(Value:any) => ValueIsListSatisfying(Value,ValueIsPlainObject)),
        optionalOrdinal ('selectionlimit'),
        optionalFunction('onselectionchange'),
        optionalFunction('onlistitemmove'),
      )

      const ListIsSelectable = (onSelectionChange != null)
      const ListIsSortable   = ListIsSelectable && (onListItemMove != null)

    /**** validate "List" (reject double entries) ****/

      const ListItemSet:Set<any> = new Set()
      List.forEach((Item:Indexable) => {
        if (ListItemSet.has(Item)) throwError(
          'InvalidArguments: the given "List" contains double entries'
        )
        ListItemSet.add(Item)
      })

    /**** provide some defaults ****/

      KeyOfListItem    = KeyOfListItem    ?? Default_KeyOfFlatListItem
      ListItemRenderer = ListItemRenderer ?? Default_FlatListItemRenderer

    /**** sanitize "selectedItems" (ignore double entries) ****/

      const SelectionSet:Set<Indexable> = new Set()
      if (ListIsSelectable) {
        if (selectedItems == null) {
          selectedItems = []
        } else {
          selectedItems = selectedItems.filter((Item:Indexable) => {
            if (SelectionSet.has(Item)) {
              return false
            } else {
              SelectionSet.add(Item)
              return true
            }
          })
        }

        if (selectedItems.length > SelectionLimit) {
          selectedItems.slice(SelectionLimit).forEach(
            (Item:any) => SelectionSet.delete(Item)
          )
          selectedItems.length = SelectionLimit
        }
      }

    /**** explicit rerendering ****/

      const [ State,setState ] = useState({
        dragging:false, DropTargetIndex:undefined, DropMode:undefined
      })

      function changeState ( StateChanges:Indexable ) {
        setState((oldState:Indexable) => ({ ...oldState, ...StateChanges }))
      }

    /**** onClick ****/

      const onClick = (Event:PointerEvent) => {
        Event.stopImmediatePropagation()

        const Item:Indexable    = (Event.target as Indexable).Item
        const Index:AIM_Ordinal = (Event.target as Indexable).Index

        executeCallback(
          'FlatListView callback "onListItemClick"',
          onListItemClick, Item,List,Index, Event
        )

        if (ListIsSelectable) {
          const additively = (
            (Event.pointerType !== 'mouse') || Event.ctrlKey || Event.metaKey
          )
          changeSelection(Item,List,Index, additively)
        }
      }

    /**** changeSelection ****/

      const changeSelection = (
        Item:Indexable, List:Indexable[], Index:AIM_Ordinal, additively:boolean
      ) => {
        if (SelectionLimit === 0) { return }

        let newSelection:Indexable[] = selectedItems
          if (additively) {
            if (SelectionSet.has(Item)) {                       // deselect item
              newSelection = selectedItems.filter(
                (selectedItem:any) => selectedItem !== Item
              )
            } else {                                // select item (if possible)
              if (selectedItems.length === SelectionLimit) {
                return
              } else {
                newSelection = [ ...selectedItems,Item ]
              }
            }
          } else {                                           // select item only
            newSelection = [Item]
          }
        executeCallback(
          'FlatListView callback "onSelectionChange"',
          onSelectionChange, newSelection,List
        )                         // caller should update selection and rerender
      }

    /**** onDragStart ****/

      const onDragStart = useCallback((Event:DragEvent) => {
        const Item:Indexable    = (Event.target as Indexable).Item
        const Index:AIM_Ordinal = (Event.target as Indexable).Index

        if (! SelectionSet.has(Item)) {              // auto-select dragged item
          const additively = (
          /* (Event.pointerType !== 'mouse') ||*/ Event.ctrlKey || Event.metaKey
          )
          changeSelection(Item,List,Index, additively)
        }

// @ts-ignore TS18047 "Event.dataTransfer" should not be null
        Event.dataTransfer.effectAllowed = 'move'
        changeState({ dragging:true })
      }, [ List, SelectionSet, changeSelection ])

    /**** onDragOver ****/

      const onDragOver = (Event:PointerEvent) => {
        const Item:Indexable    = (Event.target as Indexable).Item
        const Index:AIM_Ordinal = (Event.target as Indexable).Index

        const hoveredElement = Event.target as HTMLElement

        const Limit    = hoveredElement.getBoundingClientRect().top + hoveredElement.offsetHeight/2
        const DropMode = Event.clientY < Limit ? 'before' : 'after'

        if (SelectionSet.has(Item)) {         // don't drop onto a selected item
          if (State.DropTargetItem != null) {
            changeState({ DropTargetItem:undefined, DropMode:undefined })
          }
        } else {
          Event.preventDefault()
          if ((State.DropTargetItem !== Item) || (State.DropMode !== DropMode)) {
            changeState({ DropTargetItem:Item, DropMode })
          }
        }
      }

    /**** onDragEnd ****/

      const onDragEnd = (Event:PointerEvent) => {
        changeState({ dragging:false, DropTargetItem:undefined })
      }

    /**** onDrop ****/

      const onDrop = (Event:PointerEvent) => {
        let { DropTargetItem, DropMode } = State
        if (DropTargetItem != null) {
          const SelectionCount = selectedItems.length

        /**** move selected items ****/

          const ItemsToMove:Indexable[] = List.filter(     // in original order!
            (Item:Indexable) => SelectionSet.has(Item)
          )
          const ItemsToRemain:Indexable[] = List.filter(
            (Item:Indexable) => ! SelectionSet.has(Item)
          )

          const TargetIndex = ItemsToRemain.indexOf(DropTargetItem) + (DropMode === 'before' ? 0 : 1)

          ItemsToRemain.splice(TargetIndex,0,...ItemsToMove)
          List = ItemsToRemain

          executeCallback(
            'FlatListView callback "onListItemMove"', onListItemMove,
            List, ItemsToMove, DropTargetItem, DropMode
          )                            // caller should update list and rerender
        }
      }

    /**** actual rendering ****/

      if (List.length === 0) {
        return html`<div class="aim-component flatlistview placeholder ${Classes ?? ''}" ...${RestProps}>
          <div dangerouslySetInnerHTML=${{__html:Placeholder ?? '(empty)'}}/>
        </>`
      } else {
        const { dragging, DropTargetItem, DropMode } = State
        return html`<div class="aim-component flatlistview ${dragging ? 'dragging' : ''} ${Classes ?? ''}"
              onClick=${onClick}
          onDragStart=${ListIsSortable && onDragStart}
           onDragOver=${ListIsSortable && onDragOver}
            onDragEnd=${ListIsSortable && onDragEnd}
               onDrop=${ListIsSortable && onDrop}
          ref=${animatedElement} ...${RestProps}
        >
          ${List.map((Item:any,Index:number) => {
            const DOMRef = useRef()
            useEffect(() => {
              DOMRef.current.Item  = Item
              DOMRef.current.Index = Index
            },[])

            const Key = executedCallback(
              'FlatListView callback "KeyOfListItem"',
              KeyOfListItem,Item,List,Index
            )

            const ItemIsSelected = SelectionSet.has(Item)
            const InsertionMode  = (Item === DropTargetItem ? DropMode : '')

            return html`<div class=${'itemview' +
              (ItemIsSelected ? ' selected' : '') +
              (Item === DropTargetItem ? ` DropTarget ${DropMode}` : '')
            } key=${Key} ref=${DOMRef} draggable=${ListIsSortable}>
              ${executedCallback(
                'FlatListView callback "ListItemRenderer"',
                ListItemRenderer, Item,List,Index, ItemIsSelected,InsertionMode
              )}
            </>`
          })}
        </>`
      }
    })
  }

  installStylesheetFor('aim-component.flatlistview',`
    .aim-component.flatlistview {
      display:flex ! important; flex-flow:column nowrap ! important;
        align-items:stretch ! important;
      overflow-x:auto; overflow-y:scroll;
      border:solid 1px #888888; border-radius:2px;
      background:#DDDDDD; padding:0px;
    }

    .aim-component.flatlistview > .itemview {
      display:block; position:relative; overflow:hidden; flex:0 0 auto;
      left:0px; top:0px; width:100%; height:auto; line-height:22px;
      background:white; color:black;
      border:none; border-bottom:solid 1px lightgray;
      padding:2px 4px 2px 4px;
      white-space:nowrap; text-overflow:ellipsis;
      user-select:none; pointer-events:auto;
    }
    .aim-component.flatlistview > .itemview:last-child {
      border:none; border-bottom:solid 1px transparent;
    }

    .aim-component.flatlistview > .itemview > .default {
      height:30px; line-height:29px; overflow:hidden; text-overflow:ellipsis;
      padding-left:4px; padding-right:4px;
    }

    .aim-component.flatlistview > .itemview * {
      pointer-events:none;
    }

    .aim-component.flatlistview > .itemview.selected {
      background:dodgerblue; color:white;
    }
    .aim-component.flatlistview.dragging > .itemview.selected {
      opacity:0.3;
    }

    .aim-component.flatlistview > .itemview.before {
      border-top:solid 20px #DDDDDD;
    }
    .aim-component.flatlistview > .itemview.after {
      border-bottom:solid 21px #DDDDDD;
    }

    .aim-component.flatlistview.placeholder {
      display:flex; flex-flow:column nowrap; align-items:center; justify-content:center;
      flex:1 0 auto; overflow:hidden;
      background-color:#EEEEEE;
    }
    .aim-component.flatlistview.placeholder > * {
      display:inline-block; position:relative;
      left:0px; top:0px; right:auto; bottom:auto; width:auto; height:auto;
    }
  `)

//------------------------------------------------------------------------------
//--                              NestedListView                              --
//------------------------------------------------------------------------------

  export type AIM_NestedListItemKey           = string
  export type AIM_KeyOfNestedListItem         = (Item:Indexable ) => AIM_NestedListItemKey
  export type AIM_NestedListItemRenderer      = (Item:Indexable, isSelected:boolean, isPlain:boolean, isExpanded:boolean, InsertionDirection:''|'before'|'after') => any
  export type AIM_onNestedListItemClick       = (Item:Indexable, Event:PointerEvent) => void
  export type AIM_NestedListItemMayBeSelected = (Item:Indexable) => boolean
  export type AIM_onNestedListSelectionChange = (selectedItems:Indexable[]) => void
  export type AIM_NestedListItemMayBeExpanded = (Item:Indexable) => boolean
  export type AIM_onNestedListExpansionChange = (expandedItems:Indexable[]) => void
  export type AIM_NestedListItemMayAccept     = (TargetItem:Indexable, ItemsToMove:Indexable[]) => boolean
  export type AIM_onNestedListItemMove        = (ItemsToMove:Indexable[], TargetItem:Indexable, Direction:'before'|'after') => void

/**** Default_KeyOfNestedListItem ****/

  function Default_KeyOfNestedListItem (Item:Indexable):AIM_NestedListItemKey {
    if (KeyMap.has(Item)) {
      return ''+KeyMap.get(Item)
    } else {
      KeyCounter++
      KeyMap.set(Item,KeyCounter)
      return ''+KeyCounter
    }
  }

/**** Default_NestedListItemRenderer ****/

  function Default_NestedListItemRenderer (
    Item:Indexable, isSelected:boolean = false, isPlain:boolean = false,
    isExpanded:boolean = false, InsertionDirection:''|'before'|'after' = ''
  ):any {
    if (typeof Item.toHTML === 'function') {
      return html`<div class="default" dangerouslySetInnerHTML=${{ __html:Item.toHTML() }}/>`
    } else {
      return html`<div class="default">${''+Item}</>`
    }
  }

  export function NestedListView (PropSet:Indexable) {
    return safelyRendered(() => {
      const [ animatedElement ] = useAutoAnimate()

      let [
        Classes, List, Placeholder, KeyOfListItem, ListItemRenderer,
        ContentOfListItem, ContainerOfListItem, onListItemClick,
        ListItemMayBeSelected, selectedItems, SelectionLimit, onSelectionChange,
        ListItemMayBeExpanded, expandedItems, onExpansionChange,
        ListItemMayAccept, onListItemMove, RestProps
      ] = parsedPropSet(PropSet,
        optionalTextline('class'),
        mandatoryValue  ('list',(Value:any) => ValueIsListSatisfying(Value,ValueIsPlainObject)),
        optionalTextline('placeholder'),
        optionalFunction('keyoflistitem'),
        optionalFunction('listitemrenderer'),
        optionalFunction('contentoflistitem'),
        optionalFunction('containeroflistitem'),
        optionalFunction('onlistitemclick'),
        optionalFunction('itemmaybeselected'),
        optionalValue   ('selecteditems',(Value:any) => ValueIsListSatisfying(Value,ValueIsPlainObject)),
        optionalOrdinal ('selectionlimit'),
        optionalFunction('onselectionchange'),
        optionalFunction('itemmaybeexpanded'),
        optionalValue   ('expandeditems',(Value:any) => ValueIsListSatisfying(Value,ValueIsPlainObject)),
        optionalFunction('onexpansionchange'),
        optionalFunction('listitemmayaccept'),
        optionalFunction('onlistitemmove'),
      )

      const ListIsSelectable = (onSelectionChange != null)
      const ListIsSortable   = ListIsSelectable && (onListItemMove != null)

    /**** validate "List" (reject double entries) ****/

      const ListItemSet:Set<Indexable> = new Set()
        function scanList (List:Indexable[]):void {
          List.forEach((Item:Indexable) => {
            if (ListItemSet.has(Item)) throwError(
              'InvalidArguments: the given "List" contains double entries'
            )
            ListItemSet.add(Item)

            const innerList = executedCallback(
              'NestedListView callback "ContentOfListItem"',
              ContentOfListItem, Item
            ) as Indexable[]                          // *C* should be validated
            if (innerList != null) { scanList(innerList) }
          })
        }
      scanList(List)

    /**** provide some defaults ****/

      const emptyList = useRef([])              // makes it referentially stable
      const yeasayer  = useRef(() => true)                               // dto.

      KeyOfListItem         = KeyOfListItem    ?? Default_KeyOfNestedListItem
      ListItemRenderer      = ListItemRenderer ?? Default_NestedListItemRenderer
      ListItemMayBeSelected = ListItemMayBeSelected ?? yeasayer.current
      ListItemMayBeExpanded = ListItemMayBeExpanded ?? yeasayer.current
      expandedItems         = expandedItems     ?? emptyList.current
      ListItemMayAccept     = ListItemMayAccept ?? yeasayer.current

    /**** Containment Test ****/

      function ItemContainsItem (ItemA:Indexable, ItemB:Indexable):boolean {
        let Container = executedCallback(
          'NestedListView callback "ContainerOfListItem"',
          ContainerOfListItem, ItemB
        ) as Indexable                                // *C* should be validated
        switch (Container) {
          case null: case undefined: return false
          case ItemA:                return true
          default:                   return ItemContainsItem(ItemA,Container)
        }
      }

    /**** sanitize "selectedItems" (ignore double entries) ****/

      const SelectionSet:Set<Indexable> = new Set()
      if (ListIsSelectable) {
        if (selectedItems == null) {
          selectedItems = []
        } else {
          selectedItems = selectedItems.filter((Item:Indexable) => {
            if (SelectionSet.has(Item)) {
              return false
            } else {
              SelectionSet.add(Item)
              return true
            }
          })

          for (let i = selectedItems.length-1; i >= 0; i--) {
            const thisItem = selectedItems[i]
            if (selectedItems.some((otherItem:Indexable, j:number) => {
              return (j !== i) && ItemContainsItem(otherItem,thisItem)
            })) {
              selectedItems.splice(i,1)
              SelectionSet.delete(thisItem)
            }
          }
        }

        if (selectedItems.length > SelectionLimit) {
          selectedItems.slice(SelectionLimit).forEach(
            (Item:any) => SelectionSet.delete(Item)
          )
          selectedItems.length = SelectionLimit
        }
      }

    /**** anyOuterItemIsSelected ****/

      function anyOuterItemIsSelected (Item:Indexable):boolean {
        return selectedItems.some(
          (selectedItem:Indexable) => ItemContainsItem(selectedItem,Item)
        )
      }

    /**** deselectAllInnerItemsOf ****/

      function deselectAllInnerItemsOf (Item:Indexable):void {
        for (let i = selectedItems.length-1; i >= 0; i--) {
          const otherItem = selectedItems[i]
          if (ItemContainsItem(Item,otherItem)) {
            selectedItems.splice(i,1)
            SelectionSet.delete(otherItem)
          }
        }
      }

    /**** changeSelection ****/

      function changeSelection (
        Item:Indexable, additively:boolean
      ) {
        if (SelectionLimit === 0) { return }

        let newSelection:Indexable[] = selectedItems
          if (additively) {
            if (SelectionSet.has(Item)) {                       // deselect item
              newSelection = selectedItems.filter(
                (selectedItem:Indexable) => selectedItem !== Item
              )
            } else {               // select item - and deselect all inner items
              if (selectedItems.length === SelectionLimit) { return }

              newSelection = [ ...selectedItems.filter(
                (selectedItem:Indexable) => ! ItemContainsItem(Item,selectedItem)
              ), Item]
            }
          } else {                                           // select item only
            newSelection = [Item]
          }
        executeCallback(
          'NestedListView callback "onSelectionChange"',
          onSelectionChange, newSelection
        )                         // caller should update selection and rerender
      }

    /**** sanitize "expandedItems" (ignore double entries) ****/

      const ExpansionMap = useMemo(() => {          // because of auto-expansion
        const ExpansionMap = new Map<Indexable,'explicit'|'automatic'>()
          if (expandedItems == null) {
            expandedItems = []
          } else {
            expandedItems = expandedItems.filter((Item:Indexable) => {
              if (ExpansionMap.has(Item)) {
                return false
              } else {
                ExpansionMap.set(Item,'explicit')
                return true
              }
            })
          }
        return ExpansionMap
      },[ expandedItems ])

    /**** toggleExpansionOf ****/

      function toggleExpansionOf (Item:Indexable):void {
        if (ExpansionMap.has(Item)) {
          collapseItem(Item)
        } else {
          expandItem(Item)
        }
      }

    /**** expandItem - and all outer ones, explicitly ****/

      function expandItem (Item:Indexable):void {
        ExpansionMap.set(Item,'explicit')
        let newExpansion = [ ...expandedItems,Item ] // explicit expansions only

        let Container = executedCallback(
          'NestedListView callback "ContainerOfListItem"',
          ContainerOfListItem, Item
        ) as Indexable                                // *C* should be validated

        while (Container != null) {
          if (! ExpansionMap.has(Container)) {
            ExpansionMap.set(Container,'explicit')
            newExpansion.push(Container)
          }

          Container = executedCallback(
            'NestedListView callback "ContainerOfListItem"',
            ContainerOfListItem, Container
          ) as Indexable                              // *C* should be validated
        }

        executeCallback(
          'NestedListView callback "onExpansionChange"',
          onExpansionChange, newExpansion
        )                         // caller should update expansion and rerender
      }

    /**** collapseItem - both explicitly or automatically expanded items ****/

      function collapseItem (Item:Indexable):void {
        ExpansionMap.delete(Item)
        const newExpansion = expandedItems.filter(
          (expandedItem:Indexable) => expandedItem !== Item
        )
        executeCallback(
          'NestedListView callback "onExpansionChange"',
          onExpansionChange, newExpansion
        )                         // caller should update expansion and rerender
      }

    /**** autoExpandItem - and all outer ones (unless already expanded) ****/

      function autoExpandItem (Item:Indexable):void {
        if (! ExpansionMap.has(Item)) {
          ExpansionMap.set(Item,'automatic')
        }

        let Container = executedCallback(
          'NestedListView callback "ContainerOfListItem"',
          ContainerOfListItem, Item
        ) as Indexable                                // *C* should be validated

        while (Container != null) {
          if (! ExpansionMap.has(Container)) {
            ExpansionMap.set(Container,'automatic')
          }

          Container = executedCallback(
            'NestedListView callback "ContainerOfListItem"',
            ContainerOfListItem, Container
          ) as Indexable                              // *C* should be validated
        }
      } // deliberately, no "onExpansionChange" callback here!

    /**** autoCollapseItem - and all outer ones (unless explicitly expanded) ****/

      function autoCollapseItem (Item:Indexable):void {
        if (ExpansionMap.get(Item) === 'automatic') {
          ExpansionMap.delete(Item)
        }

        let Container = executedCallback(
          'NestedListView callback "ContainerOfListItem"',
          ContainerOfListItem, Item
        ) as Indexable                                // *C* should be validated

        while (Container != null) {
          if (ExpansionMap.get(Container) === 'automatic') {
            ExpansionMap.delete(Container)
          }

          Container = executedCallback(
            'NestedListView callback "ContainerOfListItem"',
            ContainerOfListItem, Container
          ) as Indexable                              // *C* should be validated
        }
      } // deliberately, no "onExpansionChange" callback here!

    /**** Drag-and-Drop Handling ****/

      const ListItemWithKey = useRef(new Object(null))

      const DragAndDropState = useRef({
        dragging:false,
        DropTargetItem:undefined, DropMode:undefined,
        DropTargetTimer:undefined,
      })

    /**** onDragStart ****/

      function onDragStart (Event:DragEvent):void {
        const ComponentKey = (Event.target as HTMLElement).getAttribute('data-key') as string
        const Item = ListItemWithKey.current[ComponentKey]
        if (Item == null) { return }

        if (! SelectionSet.has(Item)) {              // auto-select dragged item
          changeSelection(Item, Event.shiftKey || Event.metaKey)
        }

// @ts-ignore TS18047 "Event.dataTransfer" should not be null
        Event.dataTransfer.effectAllowed = 'move'

        ListContext.State.dragging        = true
        ListContext.State.DropTargetItem  = undefined // don't drop on dragged item
        ListContext.State.DropTargetTimer = undefined

        rerender()
      }

    /**** onDragEnter ****/

      function onDragEnter (Event:DragEvent):void {
        const ComponentKey = (Event.target as HTMLElement).getAttribute('data-key') as string
        const Item = ListItemWithKey.current[ComponentKey]

        const { DropTargetItem } = ListContext.State  // previously entered item

        if (DropTargetItem === Item) {          // this item was already entered
          Event.preventDefault()      // marks this element as valid drop target
          handleDragOver(Event,Item)
        } else {
          if (DropTargetItem != null) {         // leave previously entered item
            handleDragLeave(Event)
          }
          if (Item == null) { return }

          if (! SelectionSet.has(Item) && ! anyOuterItemIsSelected(Item)) {
            if (executedCallback(
              'NestedListView callback "ListItemMayAccept"',
              ListContext.ListItemMayAccept, Item, selectedItems
            ) != true) { return }

            Event.preventDefault()    // marks this element as valid drop target
            handleDragEnter(Event,Item)                // incl. "handleDragOver"
          }
        }
      }

    /**** onDragOver ****/

      const onDragOver = onDragEnter

    /**** onDragLeave ****/

      function onDragLeave (Event:DragEvent):void {
        const ComponentKey = (Event.target as HTMLElement).getAttribute('data-key') as string
        const Item = ListItemWithKey.current[ComponentKey]

        const { DropTargetItem } = ListContext.State
        if ((DropTargetItem === Item) || (Item == null)) {
          handleDragLeave(Event)
        }                                          // explicitly leave this item
      }

    /**** onDragEnd ****/

      function onDragEnd (Event:DragEvent) {
        onDragLeave(Event)                                                // DRY

        ListContext.State.dragging = false
        ListContext.State.DropMode = undefined

        rerender()
      }

    /**** handleDragEnter - n.b.: new item is entered before old one is left! ****/

      function handleDragEnter (Event:DragEvent, Item:Indexable):void {
        const { DropTargetTimer } = ListContext.State
        if (DropTargetTimer != null) {
          clearTimeout(DropTargetTimer)
          ListContext.State.DropTargetTimer = undefined
        }

        ListContext.State.DropTargetItem = Item

        ListContext.State.DropTargetTimer = setTimeout(() => {// auto-expand after 2s
          ListContext.State.DropTargetTimer = undefined
          if (ListContext.State.DropMode === 'after') {
            autoExpandItem(Item)
            rerender()        // since "autoExpandItem" does not rerender itself
          }
        }, 2000)

        let Container = executedCallback(
          'NestedListView callback "ContainerOfListItem"',
          ContainerOfListItem, Item
        ) as Indexable                                // *C* should be validated
        if (Container != null) {             // prevent the path to this item...
          autoExpandItem(Container)                  // ...to get auto-collapsed
          rerender()          // since "autoExpandItem" does not rerender itself
        }

        handleDragOver(Event,Item)                                        // DRY
      }

    /**** handleDragOver ****/

      function handleDragOver (Event:DragEvent, Item:Indexable):void {
        const Limit    = (Event.target as HTMLElement).getBoundingClientRect().top + (Event.target as HTMLElement).offsetHeight/2
        const DropMode = Event.clientY < Limit ? 'before' : 'after'

        if (ListContext.State.DropMode !== DropMode) {
          if ((DropMode === 'after') && (ListContext.State.DropTargetTimer == null)) {
            ListContext.State.DropTargetTimer = setTimeout(() => {// auto-expand after 2s
              ListContext.State.DropTargetTimer = undefined
              if (ListContext.State.DropMode === 'after') {
                autoExpandItem(Item)
                rerender()    // since "autoExpandItem" does not rerender itself
              }
            }, 2000)
          }

          ListContext.State.DropMode = DropMode
          rerender()
        }
      }

    /**** handleDragLeave - n.b.: new item is entered before old one is left! ****/

      function handleDragLeave (Event:DragEvent):void {
        const { DropTargetItem, DropTargetTimer } = ListContext.State

        if (DropTargetTimer != null) {
          clearTimeout(DropTargetTimer)
          ListContext.State.DropTargetTimer = undefined
        }

        if (DropTargetItem != null) {
          autoCollapseItem(DropTargetItem)
          ListContext.State.DropTargetItem = undefined
        }                                       // without explicit rerendering!

        setTimeout(rerender,500)          // wait for potential "autoExpandItem"
      }

    /**** onDrop ****/

      function onDrop (Event:PointerEvent) {
        let { DropTargetItem, DropMode } = ListContext.State
        if (DropTargetItem != null) {
          executeCallback(
            'NestedListView callback "onListItemMove"',
            onListItemMove, selectedItems, DropTargetItem, DropMode
          )                        // caller should update its list and rerender

          ListContext.State.dragging       = false
          ListContext.State.DropTargetItem = undefined
          ListContext.State.DropMode       = undefined
        }
      }


    /**** explicit rerendering ****/

      const [ State,setState ] = useState({ Rendering:0 })

      function rerender ():void {
        setState((oldState:Indexable) => ({ Rendering:oldState.Rendering+1 }))
      }

      const ListContext = {
        List, ListIsSortable, KeyOfListItem, ListItemRenderer, ContentOfListItem,
        ListIsSelectable, ListItemMayBeSelected, onListItemClick,
        SelectionSet, anyOuterItemIsSelected, changeSelection,
        ExpansionMap:ExpansionMap, ListItemMayBeExpanded, toggleExpansionOf,
        ListItemWithKey:ListItemWithKey.current, ListItemMayAccept,
        State:DragAndDropState.current, rerender
      }

    /**** actual rendering ****/

      if (List.length === 0) {
        return html`<div class="aim-component nestedlistview placeholder ${Classes ?? ''}" ...${RestProps}>
          <div dangerouslySetInnerHTML=${{__html:Placeholder ?? '(empty)'}}/>
        </>`
      } else {
        const { dragging } = ListContext.State
        return html`<div class="aim-component nestedlistview ${dragging ? 'dragging' : ''}"
          onDragStart=${onDragStart} onDragEnter=${onDragEnter} onDragOver=${onDragOver}
          onDragLeave=${onDragLeave} onDragEnd=${onDragEnd} onDrop=${onDrop}
          ref=${animatedElement} ...${RestProps}
        >
          <${NLV_ListView} List=${List}
            ListContext=${ListContext} Rendering=${State.Rendering}
          />
        </>`
      }
    })
  }

  installStylesheetFor('aim-component.nestedlistview',`
    .aim-component.nestedlistview {
      overflow-x:auto; overflow-y:scroll;
      border:solid 1px #888888; border-radius:2px;
      background:#DDDDDD; padding:0px;
    }

  /**** actual ListView ****/

    .aim-component.nestedlistview .listview {
      display:flex; position:relative; flex-flow:column nowrap; align-items:stretch;
      overflow:visible;
      margin:0px; margin-left:10px;
    }
    .aim-component.nestedlistview > .listview {
      margin-left:0px;
    }

  /**** full ListItemView ****/

    .aim-component.nestedlistview .listitemview {
      display:block; position:relative; overflow:hidden; flex:0 0 auto;
      left:0px; top:0px; width:100%; height:auto; line-height:0px;
      background:white; color:black;
      border:none;
      white-space:nowrap; text-overflow:ellipsis;
      user-select:none; pointer-events:auto;
    }

  /**** LabelLine in ListItemView ****/

    .aim-component.nestedlistview .listitemview > .labelline {
      display:block; position:relative;
      width:100%;
      border:none;
      pointer-events:none;
    }
    .aim-component.nestedlistview .listitemview:not(:last-child) > .labelline {
      border-bottom:solid 1px lightgray;
    }

    .aim-component.nestedlistview .listitemview.before > .labelline {
      border-top:solid 20px #DDDDDD;
    }
    .aim-component.nestedlistview .listitemview.after > .labelline {
      border-bottom:solid 21px #DDDDDD;
    }

  /**** LabelLine ExpansionMarker ****/

    .aim-component.nestedlistview .listitemview > .labelline > .expansion-marker {
      display:inline-block; position:absolute;
      left:0px; top:0px; width:20px; height:30px; text-align:center;
      background:none !important;
      font-family:FontAwesome; font-size:22px; line-height:29px;
      pointer-events:auto;
    }
    .aim-component.nestedlistview .listitemview > .labelline > .expansion-marker.plain::after     { content:"\\f10c"; font-size:14px; position:relative; top:-3px }
    .aim-component.nestedlistview .listitemview > .labelline > .expansion-marker.collapsed::after { content:"\\f0da" }
    .aim-component.nestedlistview .listitemview > .labelline > .expansion-marker.expanded::after  { content:"\\f0d7" }

  /**** LabelLine LabelView ****/

    .aim-component.nestedlistview .listitemview > .labelline > .labelview {
      display:inline-block; position:relative;
      left:20px; top:0px; right:0px; bottom:0px;
      padding:0px; padding-left:4px; padding-right:4px;
      overflow:hidden; text-overflow:ellipsis;
      white-space:nowrap; line-height:30px;
    }
    .aim-component.nestedlistview .listitemview.selected > .labelline {
      background-color:dodgerblue; color:white;
    }
    .aim-component.nestedlistview .listitemview.selected > .listview .labelline {
      background-color:rgba(30,144,255, 0.3); color:black;
    }

  /**** Default LabelView ****/

    .aim-component.nestedlistview .listitemview > .labelline > .labelview > .default {
      height:30px; line-height:29px; overflow:hidden; text-overflow:ellipsis;
      padding-left:4px; padding-right:4px;
    }

  /**** Placeholder ****/

    .aim-component.nestedlistview.placeholder {
      display:flex; flex-flow:column nowrap; align-items:center; justify-content:center;
      flex:1 0 auto; overflow:hidden;
      background-color:#EEEEEE;
    }
    .aim-component.nestedlistview.placeholder > * {
      display:inline-block; position:relative;
      left:0px; top:0px; right:auto; bottom:auto; width:auto; height:auto;
    }
  `)

/**** ListView inside NestedListView ****/

  function NLV_ListView (PropSet:Indexable) {
    const [ animatedElement ] = useAutoAnimate()

    const { List, ListContext, Rendering } = PropSet
if (List == null) { debugger }
    return html`<div class="listview" ref=${animatedElement}>${
      List.map((ListItem:Indexable) =>  html`<${NLV_ListItemView}
        ListItem=${ListItem} ListContext=${ListContext} Rendering=${Rendering}
      />`)
    }</>`
  }

/**** ListItemView inside NestedListView ****/

  function NLV_ListItemView (PropSet:Indexable) {
    const [ animatedElement ] = useAutoAnimate()

    const { ListItem, ListContext, Rendering } = PropSet
    const { KeyOfListItem, ContentOfListItem } = ListContext

    const innerList = executedCallback(
      'NestedListView callback "ContentOfListItem"',
      ListContext.ContentOfListItem, ListItem
    ) as Indexable[]                                  // *C* should be validated

    const ListItemIsPlain    = (innerList == null)
    const ListItemIsExpanded = ListContext.ExpansionMap.has(ListItem)
    const ListItemIsSelected = ListContext.SelectionSet.has(ListItem)

  /**** bind this component to the given ListItem ****/

    const ListItemKey = executedCallback(
      'NestedListView callback "KeyOfListItem"',
      KeyOfListItem, ListItem
    )
    useEffect(() => {
      ListContext.ListItemWithKey[ListItemKey] = ListItem
//    return () => delete ListContext.ListItemWithKey[ListItemKey]
    },[]) // *C* this approach is not stable

 /**** onClick ****/

    const onClick = (Event:PointerEvent):void => {
      Event.stopPropagation()

      executeCallback(
        'NestedListView callback "onListItemClick"',
        ListContext.onListItemClick, ListItem, Event
      )

      if (ListContext.anyOuterItemIsSelected(ListItem)) { return }
                         // do not select items inside other selected items!
      if (ListContext.ListIsSelectable) {
        if (executedCallback(
          'NestedListView callback "ListItemMayBeSelected"',
          ListContext.ListItemMayBeSelected, ListItem
        ) != true) { return }

        const additively = (
          (Event.pointerType !== 'mouse') || Event.ctrlKey || Event.metaKey
        )
        ListContext.changeSelection(ListItem,additively)
      }
    }

  /**** onExpansionClick ****/

    const onExpansionClick = (Event:PointerEvent):void => {
      Event.stopPropagation()

      const innerList = executedCallback(
        'NestedListView callback "ContentOfListItem"',
        ContentOfListItem, ListItem
      ) as Indexable[]                                // *C* should be validated
      if (innerList == null) { return }

      ListContext.toggleExpansionOf(ListItem)
      ListContext.rerender()
    }

  /**** prepare expansion marker ****/

    let ExpansionIcon = (
      ListItemIsPlain
      ? 'plain'
      : ListItemIsExpanded ? 'expanded' : 'collapsed'
    )

    let mayBeExpanded = executedCallback(
      'NestedListView callback "ListItemMayBeExpanded"',
      ListContext.ListItemMayBeExpanded, ListItem
    )

    const ExpansionMarker = html`<div
      class="expansion-marker ${ExpansionIcon} ${mayBeExpanded ? '' : 'disabled'}"
      onClick=${mayBeExpanded && onExpansionClick}
    />`

  /**** prepare Contents of expanded items ****/

    const Contents = (
      ! ListItemIsPlain && ListItemIsExpanded &&
      ! (ListContext.State.dragging && ListItemIsSelected)
      ? html`<${NLV_ListView} List=${innerList}
          ListContext=${ListContext} Rendering=${Rendering}
        />`
      : ''
    )

  /**** finally render this item ****/

    const { DropTargetItem, DropMode } = ListContext.State

    const ListItemIsDropTarget = (ListItem === DropTargetItem)
    const ListIsSortable       = ListContext.ListIsSortable

    return html`<div class=${
      'listitemview' +
      (ListItemIsSelected   ? ' selected' : '') +
      (ListItemIsDropTarget ? ` DropTarget ${DropMode}` : '')
    } ref=${animatedElement} key=${ListItemKey} data-key=${ListItemKey}
        draggable=${ListIsSortable} onClick=${onClick}
    > <div class="labelline">
        ${ExpansionMarker}
        <div class="labelview">${ListContext.ListItemRenderer(
          ListItem, ListItemIsSelected, ListItemIsPlain,
          ListItemIsExpanded, ListItemIsDropTarget ? DropMode : ''
        )}</>
      </>
      ${Contents}
    </>`
  }



//------------------------------------------------------------------------------
//--                              AppletElement                              --
//------------------------------------------------------------------------------

  class AIM_AppletElement extends HTMLElement {
    private _Renderer:AIM_Renderer

    constructor () {
      super()

    /**** get (and compile) script ****/

      let Script = unescapedHTMLAttribute(this.getAttribute('src') ?? '')
      if (Script.trim() === '') {
        this._Renderer = AppletFailingWith('')
        return
      }

      try {
// @ts-ignore TS2351 the following expression is indeed valid
        this._Renderer = new AsyncFunction('PropSet',Script) as AIM_Renderer
      } catch (Signal:any) {
        this._Renderer = AppletFailingWith(
          'Compilation Error\n\nCompiling Applet "src" failed with ' +
          (Signal.stack ?? Signal.message ?? Signal)
        )
        return
      }
    }

    connectedCallback () {
      render(html`<${AppletView} renderer=${this._Renderer}/>`,this)
    }

    disconnectedCallback () { render(null,this) }
  }
//customElements.define('aim-applet',AIM_AppletElement)               // not yet

/**** AppletFailingWith ****/

  function AppletFailingWith (Message:AIM_Text):AIM_Renderer {
    if (Message.trim() === '') {
      return function (PropSet:Indexable) { return '' }
    } else {
      return function (PropSet:Indexable) {
        return html`<${AIM_ErrorIndicator} error=${Message}/>`
      }
    }
  }

/**** AppletView ****/

  function AppletView (PropSet:Indexable):any {
    const [ asyncRendering,setAsyncRendering ] = useState()
    const asyncRenderingRef = useRef()

    const [ Error,resetError ] = useErrorBoundary()
    if (Error == null) {
      if (asyncRenderingRef.current != asyncRendering) {  // new async rendering
        asyncRenderingRef.current = asyncRendering
        return asyncRendering
      }

      let Rendering:any = PropSet.renderer({})
      if (ValueIsPromise(Rendering)) {
        Rendering               // wait for promise to be resolved (or rejected)
          .then((Rendering:any) => setAsyncRendering(Rendering))
          .catch((Error:any) => setAsyncRendering(
            html`<${AIM_ErrorIndicator} error=${Error}/>`)
          )
        return                                                 // for the moment
      } else {
        return Rendering                         // synchronous rendering result
      }
    } else {
      const Message = (
        'Applet Failure\n\nAIM Applet failed with ' +
        (Error.stack ?? Error.message ?? Error)
      )
      return html`<${AIM_ErrorIndicator} error=${Message}/>`
    }
  }

/**** escapedHTMLAttribute ****/

  function escapedHTMLAttribute (OriginalValue:AIM_Text):AIM_Text {
    return OriginalValue.replace(
      /[&<>"'\u0000-\u001F\u007F-\u009F\\]/g, function (Match:string):string {
        switch (Match) {
          case '&':  return '&amp;'
          case '<':  return '&lt;'
          case '>':  return '&gt;'
          case '"':  return '&quot;'
          case "'":  return '&apos;'
          case '\n': return '\n'            // allows line feeds to be preserved
          case '\\': return '&#92;'
          default:   let Result = Match.charCodeAt(0).toString(16)
                     return '&#x0000'.substring(3,7-Result.length) + Result + ';'
        }
      }
    )
  }

/**** unescapedHTMLAttribute ****/

  function unescapedHTMLAttribute (OriginalValue:AIM_Text):AIM_Text {
    return OriginalValue.replace(
      /&(amp|lt|gt|quot|apos|#92|#x[0-9a-fA-F]{4});/g, function (Match:string):string {
        switch (Match) {
          case '&amp;':  return '&'
          case '&lt;':   return '<'
          case '&gt;':   return '>'
          case '&quot;': return '"'
          case '&apos;': return "'"
          case '&#92;':  return '\\'
          default:
            let Code = parseInt(Match.slice(3),16)
            return String.fromCharCode(Code)
        }
      }
    )
  }

/**** consume/consumingEvent ****/

  export function consumeEvent (Event:Event, completely:boolean = false):void {
    Event.stopPropagation()
    if (completely == true) { Event.preventDefault() }
  }
  export const consumingEvent = consumeEvent

/**** executeCallback ****/

  export function executeCallback (
    Description:AIM_Textline, Callback:Function|undefined, ...ArgList:any[]
  ):any {
    expectTextline('callback description',Description)
    allowFunction             ('callback',Callback)

    if (Callback != null) {
      try {
        return Callback(...ArgList)
      } catch (Signal:any) {
        throwError(`CallbackFailure: ${Description} failed with ${''+Signal}`)
      }
    }
  }
  export const executedCallback = executeCallback

/**** deepCopyOf ****/

  export function deepCopyOf (Value:any):any {
    if ((Value === null) || (typeof Value !== 'object')) {
      return Value
    }

    if (Array.isArray(Value)) {
      return Value.map(deepCopyOf)
    }

    const Copy:Indexable = {}
      for (const Key in Value) {
        if (Value.hasOwnProperty(Key)) {
          Copy[Key] = deepCopyOf(Value[Key])
        }
      }
    return Copy
  }

  window.addEventListener('unhandledrejection', (Event) => {
    console.error(
      'caught unhandled error in Promise:',
      Event.reason?.stack ?? Event.reason?.message, Event
    )
    Event.preventDefault()
  })

  customElements.define('aim-applet',AIM_AppletElement)
