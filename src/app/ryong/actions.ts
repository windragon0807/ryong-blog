'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import { uploadResumePdf } from '@/lib/resume-pdf'

export async function uploadResumePdfAdminAction(formData: FormData) {
  const session = await auth()
  if (!session || !session.user.isAdmin) {
    redirect('/ryong/denied')
  }

  const file = formData.get('resumePdf')
  if (!(file instanceof File) || file.size === 0) {
    redirect('/ryong?upload=missing')
  }

  try {
    await uploadResumePdf(file)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'BLOB_NOT_CONFIGURED') {
        redirect('/ryong?upload=no-storage')
      }
      if (error.message === 'INVALID_FILE_TYPE') {
        redirect('/ryong?upload=invalid-type')
      }
      if (error.message === 'FILE_TOO_LARGE') {
        redirect('/ryong?upload=too-large')
      }
    }

    redirect('/ryong?upload=failed')
  }

  revalidatePath('/resume')
  revalidatePath('/ryong')
  redirect('/ryong?upload=success')
}

export async function logoutAdminAction() {
  await signOut({ redirectTo: '/' })
}
