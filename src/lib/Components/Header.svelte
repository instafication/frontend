<script lang="ts">

</script>

<Navbar class="px-0">
	<div
		class="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
	>
		<!-- logo / brand -->
		<NavBrand href="/">
			<img
				src="/images/instafication-logo-symbol-1.avif"
				class="mr-3 h-6 sm:h-9"
				alt="Instafication Logo"
			/>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Instafication
			</span>
		</NavBrand>

		<!-- mobile hamburger -->
		<!-- <NavHamburger /> -->
		<!-- right-hand tools -->
		<div class="flex items-center gap-2">
			<LanguageSelector />
			<Button
				variant="outline"
				onclick={() => {
					$showLoginModal = true;
				}}
				color="alternative"
				class="cursor-pointer"
			>
				<LogIn />
				<span>{$t('log_in')}</span>
			</Button>

			<!-- register -->
			<Button
				onclick={() => {
					$showRegisterModal = true;
				}}
				class="cursor-pointer bg-blue-700 hover:bg-blue-800"
			>
				<UserRoundPlus />
				{$t('register')}
			</Button>
		</div>
	</div>

	<!-- main nav links -->
	<!-- <NavUl
    class="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
  ></NavUl> -->
</Navbar>
