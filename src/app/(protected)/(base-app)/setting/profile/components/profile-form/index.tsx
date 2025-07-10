"use client"
import { IconTextButton } from '@/ikon/components/buttons';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Upload } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/shadcn/ui/form';
import { ProfileFormSchema } from './schema';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { AspectRatioWiseImagesProps, ImageCropperProvider, OriginalImageProps, useImageCropper } from '@/ikon/components/image-cropper-upload';
import { imageCropperFilesUpload } from '@/ikon/components/image-cropper-upload/utils';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { format } from 'date-fns';
import { ProfileDataProps } from '../type';
import { toast } from 'sonner';
import { updateUserProfile } from '@/ikon/utils/api/loginService';
import { getSrcFromBase64String } from '@/ikon/utils/actions/common/utils';
import PasswordStrengthMeter from '@/ikon/components/password-strength-meter';



function ProfileForm({ profileData }: { profileData: ProfileDataProps }) {
    console.log(profileData)
    useForm
    const form = useForm<z.infer<typeof ProfileFormSchema>>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            USER_NAME: profileData.USER_NAME,
            USER_EMAIL: profileData.USER_EMAIL,
            USER_LOGIN: profileData.USER_LOGIN,
            USER_PHONE: profileData.USER_PHONE,
            USER_PASSWORD: "",
            confirmPassword: "",
            about_me: profileData?.about_me,
            designation: profileData?.designation,
            dob: profileData?.dob && new Date(profileData.dob),
        },
    });


    const [isHovering, setIsHovering] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [aspectRatioWiseImages, setAspectRatioWiseImages] = useState<AspectRatioWiseImagesProps>();
    const [originalImage, setOriginalImage] = useState<OriginalImageProps>();

    function onCropperChange(originalImage: OriginalImageProps, aspectRatioWiseImages: AspectRatioWiseImagesProps) {
        setOriginalImage(originalImage);
        setAspectRatioWiseImages(aspectRatioWiseImages)
    }

    const [uploadedImages, setUploadedImages] = useState(profileData.imageDetails);
    const userThumbnail = useMemo(() => getSrcFromBase64String(profileData?.USER_THUMBNAIL), [profileData.USER_THUMBNAIL])


    async function saveProfile(data: z.infer<typeof ProfileFormSchema>) {
        try {
            try {
                await updateUserProfile({
                    userName: data.USER_NAME,
                    userPassword: "",
                    userPhone: data.USER_PHONE,
                    userEmail: data.USER_EMAIL,
                    userThumbnail: aspectRatioWiseImages?.icon?.split(",")[1] || profileData?.USER_THUMBNAIL || null
                })
            } catch (error) {
                console.error(error)
            }

            let imageDetails = null
            if (originalImage) {
                imageDetails = await imageCropperFilesUpload(originalImage, aspectRatioWiseImages);
            }

            const profileInst = await getMyInstancesV2({
                processName: "Profile",
                predefinedFilters: { taskName: "User Profile Edit" },
                projections: null,
            });

            const newProfileData = {
                userId: profileData.USER_ID,
                userLogin: profileData.USER_LOGIN,
                dob: format(data.dob, "yyyy-MM-dd"),
                about_me: data.about_me,
                designation: data.designation,
                imageDetails: imageDetails || profileData.imageDetails
            }

            await invokeAction({
                taskId: profileInst[0].taskId,
                transitionName: "Update User Profile Edit",
                data: newProfileData,
                processInstanceIdentifierField: "userId",
            }, []);

            toast.success("Profile updated successfully")


        } catch (error) {
            console.error(error)
        }
    }


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(saveProfile)}>
                    <div className='flex gap-3'>
                        <ImageCropperProvider
                            uploadedImages={uploadedImages}
                            onCropperChange={onCropperChange}
                            modalOpen={dialogOpen}
                            onModalOpenChange={setDialogOpen}
                        >
                            <div
                                className='relative rounded-full cursor-pointer'
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                onClick={() => setDialogOpen(true)}
                            >
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={aspectRatioWiseImages?.icon || userThumbnail} />
                                    <AvatarFallback className='bg-muted'>{profileData.USER_NAME?.match(/\b([A-Z])/g)?.join('')}</AvatarFallback>
                                </Avatar>
                                {isHovering && (
                                    <div className="w-full h-full rounded-full bg-accent text-accent-foreground absolute top-0 flex justify-center items-center opacity-75"><Upload /></div>
                                )}
                            </div>
                        </ImageCropperProvider>
                        <div className='grow h-100'>
                            <FormTextarea formControl={form.control} name={"about_me"} placeholder={"About me..."} formItemClass="h-full" className='h-full' />
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-3 mt-3'>
                        <FormInput formControl={form.control} name={"USER_LOGIN"} label={"User Login"} placeholder={"Enter User Login"} />
                        <FormInput formControl={form.control} name={"USER_NAME"} label={"User Name"} placeholder={"Enter User Name"} />
                        <FormInput formControl={form.control} name={"USER_EMAIL"} label={"User Email"} placeholder={"Enter User Email"} />
                        <FormInput formControl={form.control} name={"USER_PHONE"} label={"User Phone"} placeholder={"Enter User Phone"} />
                        <FormInput formControl={form.control} name={"designation"} label={"Designation"} placeholder={"Enter Designation"} />
                        <FormDateInput formControl={form.control} name={"dob"} label={"Date of Birth"} placeholder={"Enter Date of Birth"} />
                        <FormInput type="password" formControl={form.control} name={"USER_PASSWORD"} label={"User Password"} placeholder={"Enter Password"}
                            formDescription="* Please keep password blank if you would like to preserve old password."
                            extraFormComponent={(value) => <PasswordStrengthMeter value={value || ""} />}
                        />
                        <FormInput type="password" formControl={form.control} name={"confirmPassword"} label={"Confirm Password"} placeholder={"Enter Confirm Password"} />
                    </div>
                    <IconTextButton className='mt-3'>
                        <Save />
                        Save
                    </IconTextButton>
                </form>
            </Form>
        </>
    )
}

export default ProfileForm