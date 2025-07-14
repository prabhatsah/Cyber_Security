"use server"
import { cookies } from 'next/headers'
import { cookiePrefix } from '@/ikon/utils/config/const'

export async function setCookieSession(sessionName: string, data: string) {
  const cookieStore = await cookies()

  cookieStore.set(cookiePrefix + sessionName, data, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}


export async function getCookieSession(sessionName: string): Promise<string | undefined> {
 //console.log('getCookieSession', sessionName)
  const cookieStore = await cookies()
  //console.log('getCookieSession cookieStore', cookieStore)
  const cookie = cookieStore.get(cookiePrefix + sessionName)?.value
  //console.log('getCookieSession cookie', cookie)
  return cookie;
}


export async function clearCookieSession(sessionName: string) {
  const cookieStore = await cookies()
  cookieStore.delete(cookiePrefix + sessionName)
}

export async function clearAllCookieSession() {
  const cookieStore = await cookies()
  cookieStore.getAll().forEach(cookie => {
    if (cookie.name.startsWith(cookiePrefix)) {
      cookieStore.delete(cookie.name)
    }
  })
}
