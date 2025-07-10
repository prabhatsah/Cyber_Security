'use client'
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect, useRef } from 'react'



const reviews = [
    {
        'reviewTitle': 'just another electron based web app',
        'reviewDescription': 'not a native app like the mac version. you might as well use the website since this is just a wrapper for the website anyways',
        'reviewerName': 'Rishabh',
        'reviewTime': '2 weeks ago',
        'reviewLike': 11,
        'reviewDisLike': 1
    },
    {
        'reviewTitle': 'The REAL Open Al Chat GPT App ',
        'reviewDescription': `This so much handier then going to the web browser's page and using Chat GPT there. And better than the darn phone apps, too! With this PC app you can use your full keyboard and screen. This one is now fully functional as the web version. It will sit in your task tray once you close it, and if you click that instead of the main icon you'll be treated to a handy mini window (it can go up to large window at the touch off a button)`,
        'reviewerName': 'Robert Francis',
        'reviewTime': '2 weeks ago ',
        'reviewLike': 11,
        'reviewDisLike': 1
    },
    {
        'reviewTitle': 'Why I am more effective ',
        'reviewDescription': 'It gives you things you need days to do in seconds ',
        'reviewerName': 'Jayden',
        'reviewTime': 'About a month ago',
        'reviewLike': 11,
        'reviewDisLike': 1
    },
    {
        'reviewTitle': 'just another electron based web app',
        'reviewDescription': 'not a native app like the mac version. you might as well use the website since this is just a wrapper for the website anyways',
        'reviewerName': 'Rishabh',
        'reviewTime': '2 weeks ago',
        'reviewLike': 11,
        'reviewDisLike': 1
    },
    {
        'reviewTitle': 'just another electron based web app',
        'reviewDescription': 'not a native app like the mac version. you might as well use the website since this is just a wrapper for the website anyways',
        'reviewerName': 'Rishabh',
        'reviewTime': '2 weeks ago',
        'reviewLike': 11,
        'reviewDisLike': 1
    },
    {
        'reviewTitle': 'just another electron based web app',
        'reviewDescription': 'not a native app like the mac version. you might as well use the website since this is just a wrapper for the website anyways',
        'reviewerName': 'Rishabh',
        'reviewTime': '2 weeks ago',
        'reviewLike': 11,
        'reviewDisLike': 1
    },
    {
        'reviewTitle': 'The REAL Open Al Chat GPT App ',
        'reviewDescription': `This so much handier then going to the web browser's page and using Chat GPT there. And better than the darn phone apps, too! With this PC app you can use your full keyboard and screen. This one is now fully functional as the web version. It will sit in your task tray once you close it, and if you click that instead of the main icon you'll be treated to a handy mini window (it can go up to large window at the touch off a button)`,
        'reviewerName': 'Robert Francis',
        'reviewTime': '2 weeks ago ',
        'reviewLike': 11,
        'reviewDisLike': 1
    },
    {
        'reviewTitle': 'Why I am more effective ',
        'reviewDescription': 'It gives you things you need days to do in seconds ',
        'reviewerName': 'Jayden',
        'reviewTime': 'About a month ago',
        'reviewLike': 11,
        'reviewDisLike': 1
    }
]

export default function ShowReview({ open, setOpen }: any) {
    const allCommentslike = reviews.map((reviewLikes) => (
        reviewLikes.reviewLike
    ))

    const allCommentsDislike = reviews.map((reviewDislike) => (
        reviewDislike.reviewDisLike
    ))
    // console.log(allCommentslike + " " + allCommentsDislike);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="md:max-w-[90%] md:max-h-[90%] sm:max-w-[445px] sm:max-h-[100vh]">
                    <DialogHeader>
                        <DialogTitle className='pl-4'>Rating and Reviews</DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-col gap-5 max-h-[80vh] overflow-y-auto p-4' >
                        {
                            reviews.map((review, index) => (
                                <div className='flex flex-col gap-2' key={index}>
                                    <h1 className='text-xl font-semibold'>{review.reviewTitle}</h1>
                                    <p>{review.reviewDescription}</p>
                                    <div className='flex justify-between'>
                                        <div className='flex flex-row gap-3'>
                                            <p className='text-sm'>{review.reviewerName}</p>
                                            <p className='text-sm'>{review.reviewTime}</p>
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <div className='flex flex-row gap-2'>
                                                <ThumbsUp height={20} width={20} />
                                                <span>{review.reviewLike}</span>
                                            </div>
                                            <div className='flex flex-row gap-2'>
                                                <ThumbsDown height={20} width={20} className='self-center' />
                                                <span>{review.reviewDisLike}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
